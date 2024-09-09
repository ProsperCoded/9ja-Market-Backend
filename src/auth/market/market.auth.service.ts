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
import { ErrorMessages } from "../../constants/error-messages.enum";
import { UnauthorizedException } from "../../utils/exceptions/unauthorized.exception";
import { BadRequestException } from '../../utils/exceptions/bad-request.exception';
import { InternalServerException } from '../../utils/exceptions/internal-server.exception';
import { EmailVerificationRequestDto } from "../dtos/email-verification-request.dto";
import { NotFoundException } from '../../utils/exceptions/not-found.exception';
import { ForgotPasswordRequestDto } from "../dtos/forgot-password-request.dto";
import { ResetPasswordRequestDto } from "../dtos/reset-password-request.dto";
import { MarketRepository } from "../../repositories/market.repository";
import { MarketRegisterRequestDto } from "../dtos/market-register-request.dto";
import { IVerifyEmailRequest, VerifyEmailRequestByCodeDto, VerifyEmailRequestByTokenDto } from "../dtos/verify-email-request.dto";
import { DataFormatterHelper } from "../helpers/format.helper";


export class MarketAuthService implements IAuthService {
    private readonly logger: ILogger;
    private readonly bcryptService: BcryptService;
    private readonly jwtService: JWTService;
    private readonly emailService: EmailService;
    private readonly eventEmiter: EventEmitter;
    private readonly marketRepository: MarketRepository;

    constructor(
        logger: ILogger,
        bcryptService: BcryptService,
        jwtService: JWTService,
        marketRepository: MarketRepository
    ) {
        this.logger = logger;
        this.bcryptService = bcryptService;
        this.jwtService = jwtService;
        this.emailService = new EmailService();
        this.eventEmiter = eventEmmiter;
        this.marketRepository = marketRepository;
        this.initializeEventHandlers();
    }

    initializeEventHandlers() {
        this.eventEmiter.on(`sendMarketPasswordResetEmail`, async (data: { email: string, token: string, resetCode: string, url: string }) => {
            const { email, token, resetCode, url } = data;
            const link = url + `?token=${token}`;
            await this.emailService.sendMail({
                to: email,
                subject: EmailSubjects.PASSWORD_RESET_MARKET,
                options: {
                    template: EmailPaths.PASSWORD_RESET,
                    data: { link, resetCode }
                }
            })
        });

        this.eventEmiter.on(`sendMarketEmailVerificationEmail`, async (data: { email: string, token: string, verificationCode: number, url: string }) => {
            const { email, token, verificationCode, url } = data;
            const link = url + `/${token}`;
            await this.emailService.sendMail({
                to: email,
                subject: EmailSubjects.EMAIL_VERIFICATION_MARKET,
                options: {
                    template: EmailPaths.EMAIL_VERIFICATION,
                    data: { link, verificationCode }
                }
            })
        });

        this.eventEmiter.on(`sendMarketWelcomeEmail`, async (data: { email: string, brandName: string, }) => {
            const { email, brandName } = data;
            await this.emailService.sendMail({
                to: email,
                subject: EmailSubjects.WELCOME,
                options: {
                    template: EmailPaths.WELCOME,
                    data: { brandName }
                }
            })
        });

    }

    private getToken(payload: { [key: string]: any }, expiresIn: string = "15m"): string {
        const hash = this.jwtService.signPayload(payload, expiresIn);
        const token = cryptoService.encrypt(hash);
        console.log(`Token: ${token}`);
        return encodeURIComponent(token);
    }

    private getPayload(token: string): { [key: string]: any } {
        const decoded = decodeURIComponent(token);
        const decrypted = cryptoService.decrypt(decoded);
        const payload = this.jwtService.verifyToken(decrypted);
        return payload;
    }

    private getVerifyEmailData(data: VerifyEmailRequestByCodeDto | VerifyEmailRequestByTokenDto): IVerifyEmailRequest {
        let result: IVerifyEmailRequest;
        if ("code" in data) {
            result = { email: data.email, verificationCode: data.code };
        } else {
            result = <IVerifyEmailRequest>this.getPayload(data.token);
        }
        return result;
    }

    async login(loginData: LoginRequestDto): Promise<LoginResponseDto> {
        const { email, password } = loginData;

        const market = await this.marketRepository.getMarketByEmail(email);
        if (!market) {
            this.logger.error(ErrorMessages.INVALID_EMAIL_PASSWORD);
            throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL_PASSWORD);
        }

        const isPasswordMatch = await this.bcryptService.comparePassword(password, market.password);
        if (!isPasswordMatch) {
            this.logger.error(ErrorMessages.INVALID_EMAIL_PASSWORD);
            throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL_PASSWORD);
        }

        const payload = { email: market.email, id: market.id };
        const accessToken = this.getToken(payload, "10h");
        const _refreshToken = cryptoService.random();
        const refreshToken = this.getToken({ email: market.email, refreshToken: _refreshToken }, "7d");
        await this.marketRepository.update(market.id, { refreshToken });
        const response = new LoginResponseDto();
        response.accessToken = accessToken;
        response.refreshToken = refreshToken;
        return response;
    }

    async register(registerData: MarketRegisterRequestDto, url: string): Promise<boolean> {
        const { email, brandName, password } = registerData;

        // Check if email is already registered
        const market = await this.marketRepository.getMarketByEmail(email);
        if (market) {
            this.logger.error(ErrorMessages.EMAIL_EXISTS);
            throw new BadRequestException(ErrorMessages.EMAIL_EXISTS);
        }

        // Check if BrandName already exists
        const marketBrand = await this.marketRepository.getMarketByBrandName(brandName);
        if (marketBrand) {
            this.logger.error(ErrorMessages.BRAND_NAME_EXISTS);
            throw new BadRequestException(ErrorMessages.BRAND_NAME_EXISTS);
        }

        try {
            const hashedPassword = await this.bcryptService.hashPassword(password);
            registerData.password = hashedPassword;

            // Create new market
            const { addresses, phoneNumbers, ...newMarketData } = registerData;
            const formattedPhoneNumbers = DataFormatterHelper.formatPhoneNumbers(phoneNumbers);
            const newMarket = await this.marketRepository.create(newMarketData, addresses, formattedPhoneNumbers);

            // Send welcome email
            this.eventEmiter.emit("sendMarketWelcomeEmail", { email, brandName });

            // Send email verification code
            const verificationCode = cryptoService.randomInt();
            await this.marketRepository.update(newMarket.id, { emailVerificationCode: verificationCode });
            const token = this.getToken({ email, verificationCode });
            this.eventEmiter.emit("sendMarketEmailVerificationEmail", { email, token, verificationCode, url });
            return true;
        } catch (e) {
            this.logger.error(`${ErrorMessages.REGISTER_MARKET_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.REGISTER_MARKET_FAILED);
        }
    }

    async emailVerification(emailVerificationData: EmailVerificationRequestDto, url: string): Promise<boolean> {
        const { email } = emailVerificationData;
        const market = await this.marketRepository.getMarketByEmail(email);
        if (!market) {
            this.logger.error(ErrorMessages.MARKET_NOT_FOUND);
            throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
        }
        const verificationCode = cryptoService.randomInt();
        await this.marketRepository.update(market.id, { emailVerificationCode: verificationCode });
        const token = this.getToken({ email, verificationCode });
        this.eventEmiter.emit("sendMarketEmailVerificationEmail", { email, token, verificationCode, url });
        return true;
    }

    async verifyEmail(verifyEmailData: VerifyEmailRequestByCodeDto | VerifyEmailRequestByTokenDto): Promise<boolean> {
        try {
            const { email, verificationCode } = this.getVerifyEmailData(verifyEmailData);
            const market = await this.marketRepository.getMarketByEmail(email);
            if (!market) {
                this.logger.error(ErrorMessages.MARKET_NOT_FOUND);
                throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
            }
            if (market.emailVerificationCode !== verificationCode) {
                this.logger.error(ErrorMessages.INVALID_VERIFICATION_TOKEN);
                throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
            }
            await this.marketRepository.update(market.id, { emailVerifiedAt: new Date(), emailVerificationCode: null });
            return true;
        } catch (e) {
            // if (e instanceof JsonWebTokenError) {
                this.logger.error(ErrorMessages.INVALID_VERIFICATION_TOKEN);
                throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
            // } else {
            //     this.logger.error(`${ErrorMessages.EMAIL_VERIFICATION_FAILED}: ${e}`);
            //     throw new InternalServerException(ErrorMessages.EMAIL_VERIFICATION_FAILED);
            // }
        }

    }

    async forgotPassword(forgotPasswordData: ForgotPasswordRequestDto): Promise<boolean> {
        const { email } = forgotPasswordData;
        const market = await this.marketRepository.getMarketByEmail(email);
        if (!market) {
            this.logger.error(ErrorMessages.MARKET_NOT_FOUND);
            throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
        }
        const resetCode = cryptoService.randomInt();
        await this.marketRepository.update(market.id, { passwordResetCode: resetCode });
        // const token = this.getToken({ email, resetCode });
        this.eventEmiter.emit("sendMarketPasswordResetEmail", { email, resetCode });
        return true;
    }

    async resetPassword(resetPasswordData: ResetPasswordRequestDto): Promise<boolean> {
        try {
            const { resetCode, email, newPassword } = resetPasswordData;
            // const decrypted = cryptoService.decrypt(token);
            // const { email, resetCode } = this.jwtService.verifyToken(decrypted);
            const market = await this.marketRepository.getMarketByEmail(email);
            if (!market) {
                this.logger.error(ErrorMessages.MARKET_NOT_FOUND);
                throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
            }
            if (market.passwordResetCode !== resetCode) {
                this.logger.error(ErrorMessages.INVALID_RESET_TOKEN);
                throw new BadRequestException(ErrorMessages.INVALID_RESET_TOKEN);
            }
            const hashedPassword = await this.bcryptService.hashPassword(newPassword);
            await this.marketRepository.update(market.id, { password: hashedPassword, passwordResetCode: null });
            return true;
        } catch (e) {
            // if (e instanceof JsonWebTokenError) {
                this.logger.error(ErrorMessages.INVALID_VERIFICATION_TOKEN);
                throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
            // } else {
            //     this.logger.error(`${ErrorMessages.EMAIL_VERIFICATION_FAILED}: ${e}`);
            //     throw new InternalServerException(ErrorMessages.EMAIL_VERIFICATION_FAILED);
            //     // throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, ErrorMessages.EMAIL_VERIFICATION_FAILED);
            // }
        }
    }
}
