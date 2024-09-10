// import { NextFunction, Request, RequestHandler, Response } from "express";
// import { JWTService } from "../../jwt/jwt.service";
// import { WinstonLogger } from "../../logger/winston.logger";
// import { cryptoService } from "../../crytpo/crypto.service";
// import { ErrorMessages } from "../../../constants/error-messages.enum";
// import { UnauthorizedException } from "../../exceptions/unauthorized.exception";


// export class MarketAuthGaurd{
//     private level?: "strict";
//     constructor(
//         private readonly marketService: MarketService,
//         private readonly logger: WinstonLogger,
//         private readonly jwtService: JWTService
//     ) { }

//     authorise = (level?: typeof this.level): RequestHandler => async (request: Request, respone: Response, next: NextFunction) => {
//         this.level = level;
//         try {
//             const market = await this.validateRequest(request as { headers: { authorization: any } });
//             request.body.market = market;
//             next();
//         } catch (error) {
//             next(error);
//         }
//     }

//     private getPayload(token: string): { [key: string]: any } {
//         const decoded = decodeURIComponent(token);
//         const decrypted = cryptoService.decrypt(decoded);
//         const payload = this.jwtService.verifyToken(decrypted);
//         return payload;
//     }


//     private async validateRequest(request: { headers: { authorization: any } }): Promise<Customer> {
//         if (!request.headers.authorization) {
//             this.logger.error(ErrorMessages.NO_AUTH_ERROR);
//             throw new UnauthorizedException(ErrorMessages.NO_AUTH_ERROR);
//         }
//         const auth = request.headers.authorization;
//         if (auth.split(' ')[0] !== 'Bearer') {
//             this.logger.error(ErrorMessages.INVALID_AUTH_TOKEN_SUPPLIED);
//             throw new UnauthorizedException(ErrorMessages.INVALID_AUTH_TOKEN_SUPPLIED);
//         }
//         const token = auth.split(' ')[1];
//         try {
//             const { id } = this.getPayload(token);
//             const market = await this.marketService.getCustomerById(id);

//             // Check for Email Verification on Strict Level
//             if (this.level === "strict" && !market.emailVerifiedAt) {
//                 this.logger.error(ErrorMessages.MARKET_EMAIL_NOT_VERIFIED);
//                 throw new UnauthorizedException(ErrorMessages.MARKET_EMAIL_NOT_VERIFIED);
//             }

//             return market;
//         } catch (error) {
//             this.logger.error(`${ErrorMessages.MARKET_UNAUTHORIZED}: ${error}`);
//             throw new UnauthorizedException(ErrorMessages.MARKET_UNAUTHORIZED);
//         }
//     }


// }