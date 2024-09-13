import { NextFunction, Request, RequestHandler, Response } from "express";
import { JWTService } from "../../jwt/jwt.service";
import { WinstonLogger } from "../../logger/winston.logger";
import { Market } from "@prisma/client";
import { ErrorMessages } from "../../../constants/error-messages.enum";
import { UnauthorizedException } from '../../exceptions/unauthorized.exception';
import { cryptoService } from "../../crytpo/crypto.service";
import { MarketRepository } from "../../../repositories/market.repository";
import { NotFoundException } from "../../exceptions/not-found.exception";


export class MarketAuthGaurd {
    private strict?: boolean;
    private id?: boolean;
    constructor(
        private readonly marketRepository: MarketRepository,
        private readonly logger: WinstonLogger,
        private readonly jwtService: JWTService
    ) { }

    authorise = (options?: { strict?: boolean, id?: boolean }):
        RequestHandler => async (request: Request, resposne: Response, next: NextFunction) => {
            this.strict = options?.strict || false;
            this.id = options?.id || false;
            try {
                const market = await this.validateRequest(request as unknown as { headers: { authorization: any }, params: { marketId: string } });
                request.body.market = market;
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


    private async validateRequest(request: { headers: { authorization: any }, params: {marketId: string} }): Promise<Market> {
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
            const market = await this.marketRepository.getMarketById(id);

            if (!market) {
                this.logger.error(ErrorMessages.MARKET_NOT_FOUND);
                throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
            }

            // Check for Email Verification on Strict Level
            if (this.strict && !market.emailVerifiedAt) {
                this.logger.error(ErrorMessages.MARKET_EMAIL_NOT_VERIFIED);
                throw new UnauthorizedException(ErrorMessages.MARKET_EMAIL_NOT_VERIFIED);
            }

            // Check for ID Compatibility on ID Level
            if (this.id && market.id !== request.params.marketId) {
                this.logger.error(ErrorMessages.USER_UNAUTHORIZED);
                throw new UnauthorizedException(ErrorMessages.USER_UNAUTHORIZED);
            }

            return market;
        } catch (error) {
            this.logger.error(`${ErrorMessages.USER_UNAUTHORIZED}: ${error}`);
            throw new UnauthorizedException(ErrorMessages.USER_UNAUTHORIZED);
        }
    }
}