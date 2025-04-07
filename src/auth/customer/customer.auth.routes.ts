import { Router } from "express";
import { CustomerAuthController } from "./customer.auth.controller";
import { CustomerAuthService } from "./customer.auth.service";
import { WinstonLogger } from "../../utils/logger/winston.logger";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { JWTService } from "../../utils/jwt/jwt.service";
import { CustomerRepository } from "../../repositories/customer.repository";
import { Validator } from "../../utils/middlewares/validator.middleware";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { CustomerRegisterRequestDto } from "../dtos/customer-register-request.dto";
import { EmailVerificationRequestDto } from "../dtos/email-verification-request.dto";
import {
  VerifyEmailRequestByCodeDto,
  VerifyEmailRequestByTokenDto,
} from "../dtos/verify-email-request.dto";
import { ForgotPasswordRequestDto } from "../dtos/forgot-password-request.dto";
import { ResetPasswordRequestDto } from "../dtos/reset-password-request.dto";
import passport from "passport";
import { verifyApiKey } from "../../utils/middlewares/api-key.middleware";
import { AdminRegisterRequestDto } from "../dtos/admin-register-request.dto";

const router = Router();
const validator = new Validator();

// Customer Auth Service Dependencies
const logger = new WinstonLogger("CustomerAuthService");
const bcryptService = new BcryptService();
const jwtService = new JWTService();
const customerRepository = new CustomerRepository();

// Customer Auth Service
const customerAuthService = new CustomerAuthService(
  logger,
  bcryptService,
  jwtService,
  customerRepository
);

// Customer Auth Controller
const customerAuthController = new CustomerAuthController(customerAuthService);

/**
 * @swagger
 * tags:
 *   name: Customer Authentication
 *   description: Customer authentication and registration operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     
 *     CustomerRegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /auth/customer/login:
 *   post:
 *     summary: Login a customer
 *     tags: [Customer Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/customer/signup:
 *   post:
 *     summary: Register a new customer
 *     tags: [Customer Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/customer/email-verification:
 *   post:
 *     summary: Request email verification
 *     tags: [Customer Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */

/**
 * @swagger
 * /auth/customer/verify-email:
 *   post:
 *     summary: Verify email with code
 *     tags: [Customer Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */

/**
 * @swagger
 * /auth/customer/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Customer Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/customer/reset-password:
 *   put:
 *     summary: Reset password using reset code
 *     tags: [Customer Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input or passwords don't match
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/customer/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Customer Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refresh successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       401:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/customer/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Customer Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 */

/**
 * @swagger
 * /auth/customer/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Customer Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       200:
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *                         customer:
 *                           $ref: '#/components/schemas/Customer'
 */

/**
 * @swagger
 * /auth/customer/logout:
 *   delete:
 *     summary: Logout customer
 *     tags: [Customer Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/customer/admin/register:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Customer Authentication]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registration successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Customer'
 *       401:
 *         description: Invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Login Route
router.post(
  "/login",
  validator.single(LoginRequestDto),
  customerAuthController.login
);

// Register Route
router.post(
  "/signup",
  validator.single(CustomerRegisterRequestDto),
  customerAuthController.register
);

// Email Verification Route
router.post(
  "/email-verification",
  validator.single(EmailVerificationRequestDto),
  customerAuthController.emailVerification
);

// Verify Email By Token Param Route
router.get(
  "/verify-email-token",
  validator.single(VerifyEmailRequestByTokenDto, "query"),
  customerAuthController.verifyEmailByQuery
);

// Verify Email Route
router.post(
  "/verify-email",
  validator.single(VerifyEmailRequestByCodeDto),
  customerAuthController.verifyEmail
);

// Forgot Password Route
router.post(
  "/forgot-password",
  validator.single(ForgotPasswordRequestDto),
  customerAuthController.forgotPassword
);

// Reset Password Route
router.put(
  "/reset-password",
  validator.single(ResetPasswordRequestDto),
  customerAuthController.resetPassword
);

// Refresh Access Token Route
router.post("/refresh-token", customerAuthController.refreshToken);

// Google Auth Initiator Route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: "customer",
  })
);

// Google Auth Callback Route
router.get("/google/callback", customerAuthController.googleAuth);

// Exchange Google token
router.get("/exchange-token", customerAuthController.exchangeToken);

// Logout Route
router.delete("/logout", customerAuthController.logout);

// Admin Registration Route
router.post(
  "/admin/register",
  verifyApiKey,
  validator.single(AdminRegisterRequestDto),
  customerAuthController.registerAdmin
);

export default router;
