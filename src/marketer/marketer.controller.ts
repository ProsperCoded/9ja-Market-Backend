import { NextFunction, Request, RequestHandler, Response } from "express";
import { MarketerService } from "./marketer.service";
import { ResponseDto } from "../dtos/response.dto";
import { ResponseStatus } from "../dtos/interfaces/response.interface";
import { SuccessMessages } from "../constants/success-messages.enum";
import { HttpStatus } from "../constants/http-status.enum";
import { DataFormatterHelper } from "../helpers/format.helper";
import { Marketer } from "@prisma/client";

export class MarketerController {
  constructor(private readonly marketerService: MarketerService) {}

  private formatMarketerData(marketerData: Marketer): void {
    DataFormatterHelper.formatDatabaseObject<Marketer>(marketerData, [], "id");
  }

  /**
   * Create a new marketer
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  createMarketer: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      let identityCredentialImage;
      if (request.file) {
        identityCredentialImage = request.file.path;
      }

      const result = await this.marketerService.createMarketer(
        request.body,
        identityCredentialImage
      );

      this.formatMarketerData(result);

      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.CREATE_MARKETER_SUCCESS,
        result
      );

      return response.status(HttpStatus.CREATED).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Get all marketers
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  getAllMarketers: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.marketerService.getAllMarketers();

      // Format all marketer data
      result.forEach(this.formatMarketerData);

      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.GET_MARKETERS_SUCCESS,
        result
      );

      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Get marketer by ID
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  getMarketerById: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.marketerService.getMarketerById(
        request.params.marketerId
      );

      // Format marketer data
      this.formatMarketerData(result);

      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.GET_MARKETER_SUCCESS,
        result
      );

      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Get marketer by referrer code
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  getMarketerByReferrerCode: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.marketerService.getMarketerByReferrerCode(
        request.params.referrerCode
      );

      // Format marketer data
      this.formatMarketerData(result);

      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.GET_MARKETER_SUCCESS,
        result
      );

      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Update marketer
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  updateMarketer: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      let identityCredentialImage;
      if (request.file) {
        identityCredentialImage = request.file.path;
      }

      const result = await this.marketerService.updateMarketer(
        request.params.marketerId,
        request.body,
        identityCredentialImage
      );

      // Format marketer data
      this.formatMarketerData(result);

      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.UPDATE_MARKETER_SUCCESS,
        result
      );

      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Verify marketer
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  verifyMarketer: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.marketerService.verifyMarketer(
        request.params.marketerId
      );

      // Format marketer data
      this.formatMarketerData(result);

      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.VERIFY_MARKETER_SUCCESS,
        result
      );

      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Delete marketer
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  deleteMarketer: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await this.marketerService.deleteMarketer(request.params.marketerId);

      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.DELETE_MARKETER_SUCCESS,
        true
      );

      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Get marketer earnings
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  getMarketerEarnings: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.marketerService.getMarketerEarnings(
        request.params.marketerId
      );

      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.GET_MARKETER_EARNINGS_SUCCESS,
        result
      );

      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Get Marketer Earnings that have been paid
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  getMarketerPaidEarnings: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.marketerService.getMarketerPaidEarnings(
        request.params.marketerId
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.MARKETER_EARNINGS_RETRIEVED,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Get Marketer Earnings that are unpaid
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  getMarketerUnpaidEarnings: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.marketerService.getMarketerUnpaidEarnings(
        request.params.marketerId
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.MARKETER_EARNINGS_RETRIEVED,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Mark all unpaid earnings as paid for a marketer
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  markEarningsAsPaid: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.marketerService.markEarningsAsPaid(
        request.params.marketerId
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.MARKETER_EARNINGS_PAID,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };
}
