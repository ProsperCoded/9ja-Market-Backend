import { EventEmitter } from "stream";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { EmailService } from "../../utils/email/email.service";
import { JWTService } from "../../utils/jwt/jwt.service";
import { ILogger } from "../../utils/logger/logger.interface";
import { IAuthService } from "../interfaces/auth.service.interface";
import { eventEmmiter } from "../../utils/events";
import { EmailPaths, EmailSubjects } from "../../constants/email.enum";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { LoginResponseDto } from "../dtos/login-response.dto";
import { cryptoService } from "../../utils/crytpo/crypto.service";
import { CustomerRepository } from "../../repositories/customer.repository";
import { ErrorMessages } from "../../constants/error-messages.enum";
import { UnauthorizedException } from "../../utils/exceptions/unauthorized.exception";
import { CustomerRegisterRequestDto } from "../dtos/customer-register-request.dto";
import { BadRequestException } from "../../utils/exceptions/bad-request.exception";
import { InternalServerException } from "../../utils/exceptions/internal-server.exception";
import { EmailVerificationRequestDto } from "../dtos/email-verification-request.dto";
import { NotFoundException } from "../../utils/exceptions/not-found.exception";
import {
  IVerifyEmailRequest,
  VerifyEmailRequestByCodeDto,
  VerifyEmailRequestByTokenDto,
} from "../dtos/verify-email-request.dto";
import { ForgotPasswordRequestDto } from "../dtos/forgot-password-request.dto";
import { ResetPasswordRequestDto } from "../dtos/reset-password-request.dto";
import { DataFormatterHelper } from "../../helpers/format.helper";
import { Customer, Prisma, Role } from "@prisma/client";
import { BaseException } from "../../utils/exceptions/base.exception";
import { AdminRegisterRequestDto } from "../dtos/admin-register-request.dto";
import { MarketerRepository } from "../../repositories/marketer.repository";

export class CustomerAuthService implements IAuthService {
  private readonly logger: ILogger;
  private readonly bcryptService: BcryptService;
  private readonly jwtService: JWTService;
  private readonly emailService: EmailService;
  private readonly eventEmiter: EventEmitter;
  private readonly customerRepository: CustomerRepository;
  private readonly marketerRepository: MarketerRepository;

  constructor(
    logger: ILogger,
    bcryptService: BcryptService,
    jwtService: JWTService,
    customerRepository: CustomerRepository
  ) {
    this.logger = logger;
    this.bcryptService = bcryptService;
    this.jwtService = jwtService;
    this.emailService = new EmailService();

    this.eventEmiter = eventEmmiter;
    this.customerRepository = customerRepository;
    this.marketerRepository = new MarketerRepository();
    this.initializeEventHandlers();
  }

  initializeEventHandlers() {
    this.eventEmiter.on(
      `sendCustomerPasswordResetEmail`,
      async (data: { email: string; resetCode: string }) => {
        const { email, resetCode } = data;
        // const link = url + `/${token}`;
        await this.emailService.sendMail({
          to: email,
          subject: EmailSubjects.PASSWORD_RESET_CUSTOMER,
          options: {
            template: EmailPaths.PASSWORD_RESET,
            data: { resetCode },
          },
        });
      }
    );

    this.eventEmiter.on(
      `sendCustomerEmailVerificationEmail`,
      async (data: {
        email: string;
        token: string;
        verificationCode: number;
        url: string;
      }) => {
        const { email, token, verificationCode, url } = data;
        const link = url + `?token=${token}`;
        await this.emailService.sendMail({
          to: email,
          subject: EmailSubjects.EMAIL_VERIFICATION_CUSTOMER,
          options: {
            template: EmailPaths.EMAIL_VERIFICATION,
            data: { link, verificationCode },
          },
        });
      }
    );

    this.eventEmiter.on(
      `sendCustomerWelcomeEmail`,
      async (data: { email: string; firstName: string; lastName: string }) => {
        const { email, firstName, lastName } = data;
        await this.emailService.sendMail({
          to: email,
          subject: EmailSubjects.WELCOME_CUSTOMER,
          options: {
            template: EmailPaths.WELCOME_CUSTOMER,
            data: { firstName, lastName },
          },
        });
      }
    );
  }

  private getToken(
    payload: { [key: string]: any },
    expiresIn: string = "15m"
  ): string {
    const hash = this.jwtService.signPayload(payload, expiresIn);
    const token = cryptoService.encrypt(hash);
    return token;
  }

  private getPayload(token: string): { [key: string]: any } {
    const decrypted = cryptoService.decrypt(token);
    const payload = this.jwtService.verifyToken(decrypted);
    return payload;
  }

  private getVerifyEmailData(
    data: VerifyEmailRequestByCodeDto | VerifyEmailRequestByTokenDto
  ): IVerifyEmailRequest {
    let result: IVerifyEmailRequest;
    if ("code" in data) {
      result = { email: data.email, verificationCode: data.code };
    } else {
      const token = decodeURIComponent(data.token);
      result = <IVerifyEmailRequest>this.getPayload(token);
    }
    return result;
  }

  async login(loginData: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = loginData;

    const customer = await this.customerRepository.getCustomerByEmail(email);
    if (!customer) {
      this.logger.error(ErrorMessages.INVALID_EMAIL_PASSWORD);
      throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL_PASSWORD);
    }

    const isPasswordMatch = await this.bcryptService.comparePassword(
      password,
      customer.password!
    );
    if (!isPasswordMatch) {
      this.logger.error(ErrorMessages.INVALID_EMAIL_PASSWORD);
      throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL_PASSWORD);
    }

    const payload = { email: customer.email, id: customer.id };
    const accessToken = this.getToken(payload, "10h");
    const _refreshToken = cryptoService.random();
    const refreshToken = this.getToken(
      { email: customer.email, refreshToken: _refreshToken },
      "7d"
    );
    await this.customerRepository.update(customer.id, {
      refreshToken: _refreshToken,
    });
    const response = new LoginResponseDto();
    response.id = customer.id;
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    return response;
  }

  async register(
    registerData: CustomerRegisterRequestDto & { role?: Role },
    url: string
  ): Promise<boolean> {
    const { email, firstName, lastName, password, dateOfBirth } = registerData;

    // Set up date of birth as Date object
    if (dateOfBirth) {
      registerData.dateOfBirth = new Date(dateOfBirth);
    }

    // Check if email is already registered
    const customer = await this.customerRepository.getCustomerByEmail(email);
    if (customer) {
      this.logger.error(ErrorMessages.EMAIL_EXISTS);
      throw new BadRequestException(ErrorMessages.EMAIL_EXISTS);
    }
    try {
      // Hash password
      const hashedPassword = await this.bcryptService.hashPassword(password);
      registerData.password = hashedPassword;

      // Check if email exists in Marketer table and set role accordingly
      const marketerWithSameEmail =
        await this.marketerRepository.getMarketerByEmail(email);
      if (marketerWithSameEmail) {
        registerData.role = Role.MARKETER;
        this.logger.info(
          `Setting customer role to MARKETER for email: ${email}`
        );
      }

      // Create customer
      const { addresses, phoneNumbers, ...newCustomerData } = registerData;
      const formatedPhoneNumbers =
        DataFormatterHelper.formatPhoneNumbers(phoneNumbers);
      const newCustomer = await this.customerRepository.create(
        newCustomerData,
        addresses,
        formatedPhoneNumbers
      );

      // Send welcome email
      this.eventEmiter.emit("sendCustomerWelcomeEmail", {
        email,
        firstName: registerData.firstName || "",
        lastName: registerData.lastName || "",
      });

      // Send email verification code
      const verificationCode = cryptoService.randomInt();
      await this.customerRepository.update(newCustomer.id, {
        emailVerificationCode: verificationCode,
      });
      const _token = this.getToken({ email, verificationCode });
      const token = encodeURIComponent(_token);
      this.eventEmiter.emit("sendCustomerEmailVerificationEmail", {
        email,
        token,
        verificationCode,
        url,
      });
      return true;
    } catch (e) {
      if (e instanceof BaseException) throw e;
      this.logger.error(`${ErrorMessages.REGISTER_CUSTOMER_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.REGISTER_CUSTOMER_FAILED);
    }
  }

  async emailVerification(
    emailVerificationData: EmailVerificationRequestDto,
    url: string
  ): Promise<boolean> {
    const { email } = emailVerificationData;
    const customer = await this.customerRepository.getCustomerByEmail(email);
    if (!customer) {
      this.logger.error(ErrorMessages.CUSTOMER_NOT_FOUND);
      throw new NotFoundException(ErrorMessages.CUSTOMER_NOT_FOUND);
    }
    const verificationCode = cryptoService.randomInt();
    await this.customerRepository.update(customer.id, {
      emailVerificationCode: verificationCode,
    });
    const _token = this.getToken({ email, verificationCode });
    const token = encodeURIComponent(_token);
    this.eventEmiter.emit("sendCustomerEmailVerificationEmail", {
      email,
      token,
      verificationCode,
      url,
    });
    return true;
  }

  async verifyEmail(
    verifyEmailData: VerifyEmailRequestByCodeDto | VerifyEmailRequestByTokenDto
  ): Promise<boolean> {
    try {
      const { email, verificationCode } =
        this.getVerifyEmailData(verifyEmailData);
      const customer = await this.customerRepository.getCustomerByEmail(email);
      if (!customer) {
        this.logger.error(ErrorMessages.CUSTOMER_NOT_FOUND);
        throw new NotFoundException(ErrorMessages.CUSTOMER_NOT_FOUND);
      }
      if (customer.emailVerificationCode !== verificationCode) {
        this.logger.error(ErrorMessages.INVALID_VERIFICATION_TOKEN);
        throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
      }
      await this.customerRepository.update(customer.id, {
        emailVerifiedAt: new Date(),
        emailVerificationCode: null,
      });
      return true;
    } catch (e) {
      if (e instanceof BaseException) throw e;
      this.logger.error(ErrorMessages.INVALID_VERIFICATION_TOKEN);
      throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
    }
  }

  async forgotPassword(
    forgotPasswordData: ForgotPasswordRequestDto
  ): Promise<boolean> {
    const { email } = forgotPasswordData;
    const customer = await this.customerRepository.getCustomerByEmail(email);
    if (!customer) {
      this.logger.error(ErrorMessages.CUSTOMER_NOT_FOUND);
      throw new NotFoundException(ErrorMessages.CUSTOMER_NOT_FOUND);
    }
    const resetCode = cryptoService.randomInt();
    await this.customerRepository.update(customer.id, {
      passwordResetCode: resetCode,
    });
    // const token = this.getToken({ email, resetCode });
    this.eventEmiter.emit("sendCustomerPasswordResetEmail", {
      email,
      resetCode,
    });
    return true;
  }

  async resetPassword(
    resetPasswordData: ResetPasswordRequestDto
  ): Promise<boolean> {
    try {
      const { resetCode, newPassword, email } = resetPasswordData;
      // const decrypted = cryptoService.decrypt(token);
      // const { email, resetCode } = this.jwtService.verifyToken(decrypted);
      const customer = await this.customerRepository.getCustomerByEmail(email);
      if (!customer) {
        this.logger.error(ErrorMessages.CUSTOMER_NOT_FOUND);
        throw new NotFoundException(ErrorMessages.CUSTOMER_NOT_FOUND);
      }
      if (customer.passwordResetCode !== resetCode) {
        this.logger.error(ErrorMessages.INVALID_RESET_TOKEN);
        throw new BadRequestException(ErrorMessages.INVALID_RESET_TOKEN);
      }
      const hashedPassword = await this.bcryptService.hashPassword(newPassword);
      await this.customerRepository.update(customer.id, {
        password: hashedPassword,
        passwordResetCode: null,
      });
      return true;
    } catch (e) {
      if (e instanceof BaseException) throw e;
      this.logger.error(ErrorMessages.INVALID_VERIFICATION_TOKEN);
      throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    const payload = this.getPayload(refreshToken);
    const { email, refreshToken: _refreshToken } = payload;
    const customer = await this.customerRepository.getCustomerByEmail(email);
    if (!customer) {
      this.logger.error(ErrorMessages.CUSTOMER_NOT_FOUND);
      throw new NotFoundException(ErrorMessages.CUSTOMER_NOT_FOUND);
    }
    if (!customer.refreshToken) {
      this.logger.error(ErrorMessages.REFRESH_TOKEN_NOT_EXISTS);
      throw new UnauthorizedException(ErrorMessages.REFRESH_TOKEN_NOT_EXISTS);
    }
    if (customer.refreshToken !== _refreshToken) {
      this.logger.error(ErrorMessages.INVALID_REFRESH_TOKEN);
      throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);
    }
    const newAccessToken = this.getToken({ email, id: customer.id }, "10h");
    const response = new LoginResponseDto();
    response.id = customer.id;
    response.accessToken = newAccessToken;
    response.refreshToken = refreshToken;
    return response;
  }

  async logout(refreshToken: string): Promise<boolean> {
    const payload = this.getPayload(refreshToken);
    const { email } = payload;
    const customer = await this.customerRepository.getCustomerByEmail(email);
    if (!customer) {
      this.logger.error(ErrorMessages.CUSTOMER_NOT_FOUND);
      throw new NotFoundException(ErrorMessages.CUSTOMER_NOT_FOUND);
    }
    await this.customerRepository.update(customer.id, { refreshToken: null });
    return true;
  }

  async googleCreateOrLogin(profile: any): Promise<string> {
    const {
      emails: [{ value: emailValue, verified }],
      id,
      name: { familyName, givenName },
      photos,
    } = profile;
    try {
      let customer;
      let existingEmail;
      // Find By Email to prevent duplication
      customer = await this.customerRepository.getByGoogleId(id);
      if (!customer)
        existingEmail =
          await this.customerRepository.getCustomerByEmail(emailValue);
      if (!existingEmail && !customer) {
        let customerData: Prisma.CustomerCreateInput = {
          email: emailValue,
          googleId: id,
          firstName: givenName,
          lastName: familyName,
          emailVerifiedAt: verified ? new Date() : null,
          displayImage: photos[0].value,
        };
        const newCustomer = await this.customerRepository.create(customerData);
        const payload = { email: newCustomer.email, id: newCustomer.id };
        const accessToken = this.getToken(payload, "10h");
        const _refreshToken = cryptoService.random();
        const refreshToken = this.getToken(
          { email: newCustomer.email, refreshToken: _refreshToken },
          "7d"
        );
        await this.customerRepository.update(newCustomer.id, {
          refreshToken: _refreshToken,
        });
        const result = this.getToken(
          { id: newCustomer.id, accessToken, refreshToken },
          "7m"
        );
        return encodeURIComponent(result);
      } else {
        const customerData = customer ?? existingEmail;
        if (!customerData) {
          throw new InternalServerException(ErrorMessages.CUSTOMER_NOT_FOUND);
        }
        const payload = { email: customerData.email, id: customerData.id };
        const accessToken = this.getToken(payload, "10h");
        const _refreshToken = cryptoService.random();
        const refreshToken = this.getToken(
          { email: customerData.email, refreshToken: _refreshToken },
          "7d"
        );
        await this.customerRepository.update(customerData.id, {
          refreshToken: _refreshToken,
        });
        const result = this.getToken(
          { id: customerData.id, accessToken, refreshToken },
          "7m"
        );
        return encodeURIComponent(result);
      }
    } catch (e) {
      if (e instanceof BaseException) throw e;
      this.logger.error(`${ErrorMessages.GOOGLE_AUTH_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.GOOGLE_AUTH_FAILED);
    }
  }

  async exchangeToken(token: string): Promise<LoginResponseDto> {
    try {
      token = decodeURIComponent(token);
      const { id, accessToken, refreshToken } = this.getPayload(token);
      if (!id || !accessToken || !refreshToken) {
        this.logger.error(ErrorMessages.INVALID_EXCHANGE_TOKEN);
        throw new BadRequestException(ErrorMessages.INVALID_EXCHANGE_TOKEN);
      }
      const response = new LoginResponseDto();
      response.id = id;
      response.accessToken = accessToken;
      response.refreshToken = refreshToken;
      return response;
    } catch (e) {
      this.logger.error(`${ErrorMessages.INVALID_EXCHANGE_TOKEN}: ${e}`);
      throw new BadRequestException(ErrorMessages.INVALID_EXCHANGE_TOKEN);
    }
  }

  async registerAdmin(
    registerData: AdminRegisterRequestDto
  ): Promise<Customer> {
    const { email, password, firstName, lastName } = registerData;

    // Check if email is already registered
    const existingCustomer =
      await this.customerRepository.getCustomerByEmail(email);
    if (existingCustomer) {
      this.logger.error(ErrorMessages.EMAIL_EXISTS);
      throw new BadRequestException(ErrorMessages.EMAIL_EXISTS);
    }

    try {
      // Hash password
      const hashedPassword = await this.bcryptService.hashPassword(password);

      // Create new admin user
      const newAdmin = await this.customerRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: Role.ADMIN,
        emailVerifiedAt: new Date(), // Auto verify admin emails
      });

      // Remove sensitive data
      delete newAdmin.password;
      delete newAdmin.refreshToken;
      delete newAdmin.emailVerificationCode;
      delete newAdmin.passwordResetCode;

      return newAdmin;
    } catch (e) {
      this.logger.error(`${ErrorMessages.ADMIN_REGISTRATION_FAILED}: ${e}`);
      throw new InternalServerException(
        ErrorMessages.ADMIN_REGISTRATION_FAILED
      );
    }
  }
}
