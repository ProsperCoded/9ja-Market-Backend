import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomerService } from "../../../customer/customer.service";
import { JWTService } from "../../jwt/jwt.service";
import { WinstonLogger } from "../../logger/winston.logger";
import { Customer } from "@prisma/client";
import { ErrorMessages } from "../../../constants/error-messages.enum";
import { UnauthorizedException } from '../../exceptions/unauthorized.exception';
import { cryptoService } from "../../crytpo/crypto.service";


export class CustomerAuthGaurd {
    private level?: "strict";
    constructor(
        private readonly customerService: CustomerService,
        private readonly logger: WinstonLogger,
        private readonly jwtService: JWTService
    ) { }

    authorise = (level?: typeof this.level): RequestHandler => async (request: Request, respone: Response, next: NextFunction) => {
        this.level = level;
        try {
            const customer = await this.validateRequest(request as { headers: { authorization: any } });
            request.body.customer = customer;
            next();
        } catch (error) {
            next(error);
        }
    }

    private getPayload(token: string): { [key: string]: any } {
        const decoded = decodeURIComponent(token);
        const decrypted = cryptoService.decrypt(decoded);
        const payload = this.jwtService.verifyToken(decrypted);
        return payload;
    }
    

    private async validateRequest(request: { headers: { authorization: any } }): Promise<Customer> {
        if (!request.headers.authorization) {
            this.logger.error(ErrorMessages.NO_AUTH_ERROR);
            throw new UnauthorizedException(ErrorMessages.NO_AUTH_ERROR);
        }
        const auth = request.headers.authorization;
        if (auth.split(' ')[0] !== 'Bearer') {
            this.logger.error(ErrorMessages.INVALID_AUTH_TOKEN_SUPPLIED);
            throw new UnauthorizedException(ErrorMessages.INVALID_AUTH_TOKEN_SUPPLIED);
        }
        const token = auth.split(' ')[1];
        try {
            const { id } = this.getPayload(token);
            const customer = await this.customerService.getCustomerById(id);

            // Check for Email Verification on Strict Level
            if (this.level === "strict" && !customer.emailVerifiedAt) {
                this.logger.error(ErrorMessages.CUSTOMER_EMAIL_NOT_VERIFIED);
                throw new UnauthorizedException(ErrorMessages.CUSTOMER_EMAIL_NOT_VERIFIED);
            }

            return customer;
        } catch (error) {
            this.logger.error(`${ErrorMessages.USER_UNAUTHORIZED}: ${error}`);
            throw new UnauthorizedException(ErrorMessages.USER_UNAUTHORIZED);
        }
    }
}