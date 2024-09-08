import { Router } from "express";
import { MarketAuthController } from "./market.auth.controller";
import { MarketAuthService } from "./market.auth.service";
import { WinstonLogger } from "../../utils/logger/winston.logger";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { JWTService } from "../../utils/jwt/jwt.service";
import { MarketRepository } from "../../repositories/market.repository";
import { validateBody } from "../../utils/middlewares/validator.middleware";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { MarketRegisterRequestDto } from "../dtos/market-register-request.dto";
import { EmailVerificationRequestDto } from "../dtos/email-verification-request.dto";
import { VerifyEmailRequestDto } from "../dtos/verify-email-request.dto";
import { ForgotPasswordRequestDto } from "../dtos/forgot-password-request.dto";
import { ResetPasswordRequestDto } from "../dtos/reset-password-request.dto";

const router = Router();

// Market Auth Service Dependencies
const logger = new WinstonLogger('MarketAuthService');
const bcryptService = new BcryptService();
const jwtService = new JWTService();
const marketRepository = new MarketRepository();


// Market Auth Service
const marketAuthService = new MarketAuthService(logger, bcryptService, jwtService, marketRepository);

// Market Auth Controller
const marketAuthController = new MarketAuthController(marketAuthService);

// Login Route
router.post('/login', validateBody(LoginRequestDto), marketAuthController.login);

// Register Route
router.post('/register', validateBody(MarketRegisterRequestDto), marketAuthController.register);

// Email Verification Route
router.post('/email-verification', validateBody(EmailVerificationRequestDto), marketAuthController.emailVerification);

// Verify Email Route
router.post('/verify-email', validateBody(VerifyEmailRequestDto), marketAuthController.verifyEmail);

// Forgot Password Route
router.post('/forgot-password', validateBody(ForgotPasswordRequestDto), marketAuthController.forgotPassword);

// Reset Password Route
router.post('/reset-password', validateBody(ResetPasswordRequestDto), marketAuthController.resetPassword);


export default router;