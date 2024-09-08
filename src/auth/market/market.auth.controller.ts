import { NextFunction, Request, RequestHandler, Response } from "express";
import { MarketAuthService } from "./market.auth.service";
import { ResponseDto } from "../../dtos/response.dto";
import { ResponseStatus } from "../../dtos/interfaces/response.interface";
import { SuccessMessages } from "../../constants/success-messages.enum";
import { HttpStatus } from "../../constants/http-status.enum";

export class MarketAuthController {
    constructor(private readonly marketAuthService: MarketAuthService) { }

    /**
   * Authenticates Market
   * @param request {Request}
   * @param response (Response}
   * @param next {NextFunction}
   */

    login: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await this.marketAuthService.login(request.body);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.LOGIN_SUCCESSFUL, result);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Registers Market
     * @param request {Request}
     * @param response {Response}
     * @param next {NextFunction}
     */
    register: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.marketAuthService.register(request.body);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.REGISTRATION_SUCCESSFUL);
            return response.status(HttpStatus.CREATED).send(resObj);
        } catch (e) {
            next(e);
        }
    }


    /**
     * Email Verification Email
     * @param request {Request}
     * @param response {Response}
     * @param next {NextFunction}
     */
    emailVerification: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.marketAuthService.emailVerification(request.body);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.VERIFICATION_EMAIL_SENT);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Verify Email
     * @param request {Request}
     * @param response {Response}
     * @param next {NextFunction}
     */
    verifyEmail: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.marketAuthService.verifyEmail(request.body);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.EMAIL_VERIFICATION_SUCCESS);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Forgot Password
     * @param request {Request}
     * @param response {Response}
     * @param next {NextFunction}
     */
    forgotPassword: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.marketAuthService.forgotPassword(request.body);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.FORGOT_PASSWORD_SUCCESS);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Reset Password
     * @param request {Request}
     * @param response {Response}
     * @param next {NextFunction}
     */
    resetPassword: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.marketAuthService.resetPassword(request.body);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.RESET_PASSWORD_SUCCESS);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }
}