import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomerService } from "./customer.service";
import { ResponseDto } from "../dtos/response.dto";
import { ResponseStatus } from "../dtos/interfaces/response.interface";
import { SuccessMessages } from "../constants/success-messages.enum";
import { HttpStatus } from "../constants/http-status.enum";
import { DataFormatterHelper } from "../helpers/format.helper";
import { Customer, Prisma } from "@prisma/client";

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  private formatCustomerData(customerData: Customer): void {
    DataFormatterHelper.formatDatabaseObject<Customer>(
      customerData,
      [
        "refreshToken",
        "emailVerificationCode",
        "password",
        "passwordResetCode",
        "refreshToken",
      ],
      "id"
    );
  }

  /**
   * Get Customer profile
   * @param request {Request}
   * @param response (Response}
   * @param next {NextFunction}
   */
  getCustomerById: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.customerService.getCustomerById(
        request.body.customer.id
      );
      this.formatCustomerData(result);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.GET_CUSTOMER_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Update Customer profile
   * @param request {Request}
   * @param response (Response}
   * @param next {NextFunction}
   */

  updateCustomer: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.customerService.updateCustomer(
        request.params.customerId,
        request.body
      );
      this.formatCustomerData(result);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.UPDATE_CUSTOMER_SUCCESS,
        result
      );
      return response.status(HttpStatus.OK).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Delete Customer profile
   * @param request {Request}
   * @param response (Response}
   * @param next {NextFunction}
   */

  deleteCustomer: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      await this.customerService.deleteCustomer(request.params.customerId);
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        SuccessMessages.DELETE_CUSTOMER_SUCCESS
      );
      return response.status(HttpStatus.NO_CONTENT).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  getCustomerMarketerProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body.customer;
      const marketerProfile =
        await this.customerService.getMarketerByCustomerEmail(email);
      res.status(200).json({
        status: "success",
        message: "Marketer profile retrieved successfully",
        data: marketerProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  getCustomerMarketerReferrals = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body.customer;

      // First, get the marketer profile to ensure they are a marketer
      const marketerProfile =
        await this.customerService.getMarketerByCustomerEmail(email);

      // Then get their referrals with profit information
      const referrals = await this.customerService.getMarketerReferrals(
        marketerProfile.id
      );

      res.status(200).json({
        status: "success",
        message: "Marketer referrals retrieved successfully",
        data: referrals,
      });
    } catch (error) {
      next(error);
    }
  };
}
