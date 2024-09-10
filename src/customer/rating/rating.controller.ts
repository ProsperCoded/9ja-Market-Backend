import { NextFunction, Request, RequestHandler, Response } from "express";
import { RatingService } from "./rating.service";
import { ResponseDto } from "../../dtos/response.dto";
import { ResponseStatus } from "../../dtos/interfaces/response.interface";
import { SuccessMessages } from "../../constants/success-messages.enum";
import { HttpStatus } from "../../constants/http-status.enum";
import { DataFormatterHelper } from "../../helpers/format.helper";

export class RatingController {
    constructor(private readonly ratingService: RatingService) { }

    /**
* Get Ratings for a Product
* @param request {Request}
* @param response (Response}
* @param next {NextFunction}
*/
    getRatings: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await this.ratingService.getAllRatings(request.params.productId);
            result.forEach(item => DataFormatterHelper.formatDatabaseObject(item));
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.GET_RATINGS_SUCCESS, result);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

    /**
* Create Rating
* @param request {Request}
* @param response (Response}
* @param next {NextFunction}
*/
    createRating: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await this.ratingService.createRating(request.body.customer.id, request.params.productId, request.body);
            result.forEach(item => DataFormatterHelper.formatDatabaseObject(item));
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.CREATE_RATING_SUCCESS, result);
            return response.status(HttpStatus.CREATED).send(resObj);
        } catch (e) {
            next(e);
        }
    }

    /**
* Update Rating
* @param request {Request}
* @param response (Response}
* @param next {NextFunction}
*/

    updateRating: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await this.ratingService.updateRating(request.body.customer.id, request.params.productId, request.body);
            result.forEach(item => DataFormatterHelper.formatDatabaseObject(item));
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.UPDATE_RATING_SUCCESS, result);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

    /**
* Delete Rating
* @param request {Request}
* @param response (Response}
* @param next {NextFunction}
*/

    deleteRating: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.ratingService.deleteRating(request.body.customer.id, request.params.productId);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.DELETE_RATING_SUCCESS);
            return response.status(HttpStatus.NO_CONTENT).send(resObj);
        } catch (e) {
            next(e);
        }
    }
}