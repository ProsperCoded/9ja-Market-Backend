import { EventEmitter } from "stream";
import { v4 as uuid4 } from "uuid";
import { BcryptService } from "../../../utils/bcrypt/bcrypt.service";
import { EmailService } from "../../../utils/email/email.service";
import { JWTService } from "../../../utils/jwt/jwt.service";
import { ILogger } from "../../../utils/logger/logger.interface";
import { IAuthService } from "../auth.service.interface";
import { eventEmmiter } from "../../../utils/events";
import { EmailPaths } from "../../../constants/email-paths.enum";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { LoginResponseDto } from "../dtos/login-response.dto";
import { cryptoService } from "../../../utils/crytpo/crypto.service";
import { CustomerRepository } from "../../../repositories/customer.repository";
import { ErrorMessages } from "../../../constants/error-messages.enum";
import { UnauthorizedException } from "../../../utils/exceptions/unauthorized.exception";
import { CustomerRegisterRequestDto } from "./dtos/customer-register-request.dto";
import { BadRequestException } from '../../../utils/exceptions/bad-request.exception';
import { InternalServerException } from '../../../utils/exceptions/internal-server.exception';
import { EmailVerificationRequestDto } from "../dtos/email-verification-request.dto";
import { NotFoundException } from '../../../utils/exceptions/not-found.exception';
import { VerifyEmailRequestDto } from "../dtos/verify-email-request.dto";
import { JsonWebTokenError } from "jsonwebtoken";
import { ForgotPasswordRequestDto } from "../dtos/forgot-password-request.dto";
import { ResetPasswordRequestDto } from "../dtos/reset-password-request.dto";
import { Prisma } from "@prisma/client";


export class CustomerAuthService implements IAuthService {
    private readonly logger: ILogger;
    private readonly bcryptService: BcryptService;
    private readonly jwtService: JWTService;
    private readonly emailService: EmailService;
    private readonly eventEmiter: EventEmitter;
    private readonly customerRepository: CustomerRepository;

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
        this.initializeEventHandlers();
    }

    initializeEventHandlers() {
        this.eventEmiter.on(`sendCustomerPasswordResetEmail`, async (data: { email: string, token: string }) => {
            const { email, token } = data;
            const link = token;
            await this.emailService.sendMail({
                to: email,
                subject: "Forgot Password",
                options: {
                    template: EmailPaths.PASSWORD_RESET,
                    data: { link }
                }
            })
        });

        this.eventEmiter.on(`sendCustomerEmailVerificationEmail`, async (data: { email: string, token: string }) => {
            const { email, token } = data;
            const link = token;
            await this.emailService.sendMail({
                to: email,
                subject: "Email Verification",
                options: {
                    template: EmailPaths.EMAIL_VERIFICATION,
                    data: { link }
                }
            })
        });

        this.eventEmiter.on(`sendCustomerWelcomeEmail`, async (data: { email: string, firstName: string, lastName: string }) => {
            const { email, firstName, lastName } = data;
            await this.emailService.sendMail({
                to: email,
                subject: "Welcome to Buyier",
                options: {
                    template: EmailPaths.WELCOME,
                    data: { firstName, lastName }
                }
            })
        });

    }

    private getToken(payload: { [key: string]: any }, expiresIn: string = "15m"): string {
        const hash = this.jwtService.signPayload(payload, expiresIn);
        const token = cryptoService.encrypt(hash);
        return token;
    }

    async login(loginData: LoginRequestDto): Promise<LoginResponseDto> {
        const { email, password } = loginData;

        const customer = await this.customerRepository.getCustomerByEmail(email);
        if (!customer) {
            this.logger.error(ErrorMessages.INVALID_EMAIL_PASSWORD);
            throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL_PASSWORD);
        }

        const isPasswordMatch = await this.bcryptService.comparePassword(password, customer.password);
        if (!isPasswordMatch) {
            this.logger.error(ErrorMessages.INVALID_EMAIL_PASSWORD);
            throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL_PASSWORD);
        }

        const payload = { email: customer.email, id: customer.id };
        const accessToken = this.getToken(payload, "10h");
        const _refreshToken = cryptoService.random();
        const refreshToken = this.getToken({ email: customer.email, refreshToken: _refreshToken }, "7d");
        await this.customerRepository.update(customer.id, { refreshToken });
        const response = new LoginResponseDto();
        response.accessToken = accessToken;
        response.refreshToken = refreshToken;
        return response;
    }

    async register(registerData: CustomerRegisterRequestDto): Promise<boolean> {
        const { email, firstName, lastName, password } = registerData;
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

            // Create customer
            const { addresses, phoneNumbers, ...newCustomerData } = registerData;
            const mappedPhoneNumbers = phoneNumbers.map(number => ({ number }));
            const newCustomer = await this.customerRepository.create(newCustomerData, addresses, mappedPhoneNumbers);

            // Send welcome email
            this.eventEmiter.emit("sendCustomerWelcomeEmail", { email, firstName, lastName });

            // Send email verification code
            const verificationCode = uuid4();
            await this.customerRepository.update(newCustomer.id, { emailVerificationCode: verificationCode });
            const token = this.getToken({ email, verificationCode });
            this.eventEmiter.emit("sendCustomerEmailVerificationEmail", { email, token });
            return true;
        } catch (e) {
            this.logger.error(`${ErrorMessages.REGISTER_CUSTOMER_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.REGISTER_CUSTOMER_FAILED);
        }
    }

    async emailVerification(emailVerificationData: EmailVerificationRequestDto): Promise<boolean> {
        const { email } = emailVerificationData;
        const customer = await this.customerRepository.getCustomerByEmail(email);
        if (!customer) {
            this.logger.error(ErrorMessages.CUSTOMER_NOT_FOUND);
            throw new NotFoundException(ErrorMessages.CUSTOMER_NOT_FOUND);
        }
        const verificationCode = uuid4();
        await this.customerRepository.update(customer.id, { emailVerificationCode: verificationCode });
        const token = this.getToken({ email, verificationCode });
        this.eventEmiter.emit("sendCustomerEmailVerificationEmail", { email, token });
        return true;
    }

    async verifyEmail(verifyEmailData: VerifyEmailRequestDto): Promise<boolean> {
        try {
            const { token } = verifyEmailData;
            const decrypted = cryptoService.decrypt(token);
            const { email, verificationCode } = this.jwtService.verifyToken(decrypted);
            const customer = await this.customerRepository.getCustomerByEmail(email);
            if (!customer) {
                this.logger.error(ErrorMessages.CUSTOMER_NOT_FOUND);
                throw new NotFoundException(ErrorMessages.CUSTOMER_NOT_FOUND);
            }
            if (customer.emailVerificationCode !== verificationCode) {
                this.logger.error(ErrorMessages.INVALID_VERIFICATION_TOKEN);
                throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
            }
            await this.customerRepository.update(customer.id, { emailVerifiedAt: new Date(), emailVerificationCode: null });
            return true;
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                this.logger.error(ErrorMessages.INVALID_VERIFICATION_TOKEN);
                throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
            } else {
                this.logger.error(`${ErrorMessages.EMAIL_VERIFICATION_FAILED}: ${e}`);
                throw new InternalServerException(ErrorMessages.EMAIL_VERIFICATION_FAILED);
                // throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, ErrorMessages.EMAIL_VERIFICATION_FAILED);
            }
        }

    }

    async forgotPassword(forgotPasswordData: ForgotPasswordRequestDto): Promise<boolean> {
        const { email } = forgotPasswordData;
        const customer = await this.customerRepository.getCustomerByEmail(email);
        if (!customer) {
            this.logger.error(ErrorMessages.CUSTOMER_NOT_FOUND);
            throw new NotFoundException(ErrorMessages.CUSTOMER_NOT_FOUND);
        }
        const resetCode = uuid4();
        await this.customerRepository.update(customer.id, { passwordResetCode: resetCode });
        const token = this.getToken({ email, resetCode });
        this.eventEmiter.emit("sendCustomerPasswordResetEmail", { email, token });
        return true;
    }

    async resetPassword(resetPasswordData: ResetPasswordRequestDto): Promise<boolean> {
        try {
            const { token, newPassword } = resetPasswordData;
            const decrypted = cryptoService.decrypt(token);
            const { email, resetCode } = this.jwtService.verifyToken(decrypted);
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
            await this.customerRepository.update(customer.id, { password: hashedPassword, passwordResetCode: null });
            return true;
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                this.logger.error(ErrorMessages.INVALID_VERIFICATION_TOKEN);
                throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
            } else {
                this.logger.error(`${ErrorMessages.EMAIL_VERIFICATION_FAILED}: ${e}`);
                throw new InternalServerException(ErrorMessages.EMAIL_VERIFICATION_FAILED);
                // throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, ErrorMessages.EMAIL_VERIFICATION_FAILED);
            }
        }
    }
}
