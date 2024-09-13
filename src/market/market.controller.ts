import { Market } from "@prisma/client";
import { MarketService } from "./market.service";
import { DataFormatterHelper } from "../helpers/format.helper";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseDto } from "../dtos/response.dto";
import { ResponseStatus } from "../dtos/interfaces/response.interface";
import { SuccessMessages } from "../constants/success-messages.enum";
import { HttpStatus } from "../constants/http-status.enum";


export class MarketController {
    constructor(private readonly marketService: MarketService) { }

    private formatMarketData(marketData: Market): void {
        DataFormatterHelper.formatDatabaseObject<Market>(marketData, ["refreshToken", "emailVerificationCode", "password", "passwordResetCode", "refreshToken"], "id");
    }

    /**
* Get Market Details
* @param request {Request}
* @param response (Response}
* @param next {NextFunction}
*/
    getMarketById: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await this.marketService.getMarketById(request.body.market.id);
            this.formatMarketData(result);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.GET_MARKET_SUCCESS, result);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

    /**
* Update Market Details
* @param request {Request}
* @param response (Response}
* @param next {NextFunction}
*/

    updateMarket: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await this.marketService.updateMarket(request.params.id, request.body);
            this.formatMarketData(result);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.UPDATE_MARKET_SUCCESS, result);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

    /**
* Delete Market
* @param request {Request}
* @param response (Response}
* @param next {NextFunction}
*/

    deleteMarket: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await this.marketService.deleteMarket(request.params.id);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.DELETE_MARKET_SUCCESS, result);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }
}