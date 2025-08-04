import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomerAuthService } from "./customer.auth.service";
import { ResponseDto } from "../../dtos/response.dto";
import { ResponseStatus } from "../../dtos/interfaces/response.interface";
import { SuccessMessages } from "../../constants/success-messages.enum";
import { HttpStatus } from "../../constants/http-status.enum";
import { RequestParserHelper } from "../../helpers/request-parser.helper";
import { AppEnum } from "../../constants/app.enum";

export class CustomerAuthController {
  constructor(private readonly customerAuthService: CustomerAuthService) {}

  /**
   * Authenticates User
   * @param request {Request}
   * @param response (Response}
   * @param next {NextFunction}
   */

  login: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.customerAuthService.login(request.body);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.LOGIN_SUCCESSFUL,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Registers User
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  register: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const url = new RequestParserHelper(request).getUrl(
        "/auth/customer/verify-email-token"
      );
      await this.customerAuthService.register(request.body, url);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.REGISTRATION_SUCCESSFUL
      );
      return response.status(HttpStatus.CREATED).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Email Verification Email
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  emailVerification: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const url = new RequestParserHelper(request).getUrl(
        "/auth/customer/verify-email-token"
      );
      await this.customerAuthService.emailVerification(request.body, url);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.VERIFICATION_EMAIL_SENT
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Verify Email By Query
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  verifyEmailByQuery: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await this.customerAuthService.verifyEmail(
        request.query as { token: string }
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.EMAIL_VERIFICATION_SUCCESS
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Verify Email
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  verifyEmail: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await this.customerAuthService.verifyEmail(request.body);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.EMAIL_VERIFICATION_SUCCESS
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Forgot Password
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  forgotPassword: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      // const url = new RequestParserHelper(request).getUrl('/auth/customer/reset-password');
      await this.customerAuthService.forgotPassword(request.body);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.FORGOT_PASSWORD_SUCCESS
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Reset Password
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  resetPassword: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await this.customerAuthService.resetPassword(request.body);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.RESET_PASSWORD_SUCCESS
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Refresh Token
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  refreshToken: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.customerAuthService.refreshToken(
        request.body.refreshToken
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.REFRESH_TOKEN_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Google Auth
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  googleAuth: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const profile = JSON.parse(request.query.profile as string);
      const result =
        await this.customerAuthService.googleCreateOrLogin(profile);
      return response.redirect(
        `${AppEnum.CLIENT_URL}/auth?token=${result}&userType=customer`
      );
    } catch (e: any) {
      return response.redirect(`${AppEnum.CLIENT_URL}/?error=${e.message}`);
    }
  };

  /**
   * Exchange Token
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  exchangeToken: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.customerAuthService.exchangeToken(
        request.query.token as string
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.LOGIN_SUCCESSFUL,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Logout
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */

  logout: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await this.customerAuthService.logout(request.body.refreshToken);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.LOGOUT_SUCCESS
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Registers Admin User
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  registerAdmin: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.customerAuthService.registerAdmin(request.body);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.ADMIN_REGISTRATION_SUCCESSFUL,
        result
      );
      return response.status(HttpStatus.CREATED).send(resObj);
    } catch (e) {
      next(e);
    }
  };
}
