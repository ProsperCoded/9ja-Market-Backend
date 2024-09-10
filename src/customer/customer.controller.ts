import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomerService } from "./customer.service";
import { ResponseDto } from "../dtos/response.dto";
import { ResponseStatus } from "../dtos/interfaces/response.interface";
import { SuccessMessages } from "../constants/success-messages.enum";
import { HttpStatus } from "../constants/http-status.enum";
import { DataFormatterHelper } from "../helpers/format.helper";


export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

     /**
   * Get Customer profile
   * @param request {Request}
   * @param response (Response}
   * @param next {NextFunction}
   */
    getCustomerById: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const _result = await this.customerService.getCustomerById(request.body.customer.id);
            const result = DataFormatterHelper.formatCustomer(_result);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.GET_CUSTOMER_SUCCESS, result);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

     /**
   * Update Customer profile
   * @param request {Request}
   * @param response (Response}
   * @param next {NextFunction}
   */

    updateCustomer: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const _result = await this.customerService.updateCustomer(request.params.id, request.body);
            const result = DataFormatterHelper.formatCustomer(_result);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.UPDATE_CUSTOMER_SUCCESS, result);
            return response.status(HttpStatus.OK).send(resObj);
        } catch (e) {
            next(e);
        }
    }

     /**
   * Delete Customer profile
   * @param request {Request}
   * @param response (Response}
   * @param next {NextFunction}
   */

    deleteCustomer: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.customerService.deleteCustomer(request.params.id);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.DELETE_CUSTOMER_SUCCESS);
            return response.status(HttpStatus.NO_CONTENT).send(resObj);
        } catch (e) {
            next(e);
        }
    }
}