import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdService } from "./ad.service";
import { ResponseDto } from "../dtos/response.dto";
import { ResponseStatus } from "../dtos/interfaces/response.interface";
import { HttpStatus } from "../constants/http-status.enum";
import { SuccessMessages } from "../constants/success-messages.enum";
import { AdPrices } from "../constants/ad-constants.enum";

export class AdController {
  constructor(private readonly adService: AdService) {}

  /**
   * Activate Free Ad
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */

  activateFreeAd: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.adService.activateFreeAd(
        request.params.productId,
        request.body.merchant
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.FREE_AD_ACTIVATION_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Initialize Ad Payment
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */

  initializeAdPayment: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.adService.initializeAdPayment(
        parseInt(request.params.level) as unknown as keyof typeof AdPrices,
        request.params.productId,
        request.body.merchant
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.AD_PAYMENT_INITIALIZATION_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Verify Ad Payment
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */

  verifyAdPayment: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.adService.verifyAdPayment(
        request.params.reference
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.AD_PAYMENT_VERIFICATION_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  getAllFilteredAds: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { market: marketId, merchant: merchantId } = request.query;
      const filters = {
        ...(marketId && { marketId: marketId as string }),
        ...(merchantId && { merchantId: merchantId as string }),
      };
      const result = await this.adService.getAllFilteredAds(filters);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.AD_FETCH_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };
  /**
   * Get Ads with optional market and merchant filters
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  getFilteredAds: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { market: marketId, merchant: merchantId } = request.query;
      const filters = {
        ...(marketId && { marketId: marketId as string }),
        ...(merchantId && { merchantId: merchantId as string }),
      };

      const result = await this.adService.getFilteredAds(filters);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.AD_FETCH_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  getAd: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.adService.getAd(request.params.adId);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.AD_FETCH_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  getAdByProduct: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.adService.getAdByProduct(
        request.params.productId
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.AD_FETCH_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Track Ad Click
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  trackAdClick: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await this.adService.incrementAdClicks(request.params.adId);
      return response.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      next(e);
    }
  };

  /**
   * Track Ad View
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  trackAdView: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await this.adService.incrementAdViews(request.params.adId);
      return response.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      next(e);
    }
  };

  /**
   * Get Ad Revenue Statistics
   * @param request {Request}
   * @param response {Response}
   * @param next {NextFunction}
   */
  getAdRevenue: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.adService.getAdRevenue();
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.AD_REVENUE_FETCH_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };
}
