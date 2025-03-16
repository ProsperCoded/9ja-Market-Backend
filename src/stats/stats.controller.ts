import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatsService } from "./stats.service";
import { ResponseDto } from "../dtos/response.dto";
import { ResponseStatus } from "../dtos/interfaces/response.interface";
import { HttpStatus } from "../constants/http-status.enum";
import { SuccessMessages } from "../constants/success-messages.enum";

export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  getPlatformStats: RequestHandler = async (
    _request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.statsService.getPlatformStats();
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.STATS_FETCH_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  getAdRevenue: RequestHandler = async (
    _request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.statsService.getAdRevenue();
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.REVENUE_FETCH_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  getAllStats: RequestHandler = async (
    _request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.statsService.getAllStats();
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.STATS_FETCH_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };
}
