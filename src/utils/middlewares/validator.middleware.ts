import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ValidationException } from "../exceptions/validation.exception";
import { ErrorMessages } from "../../constants/error-messages.enum";


export function validateBody(schema: any) {
    return (request: Request, response: Response, next: NextFunction) => {
        validate(plainToInstance(schema, request.body), { skipMissingProperties: true }).then(errors => {
            if (errors.length > 0) {
                const errorString = errors.map((error: ValidationError) => Object.values(error.constraints!)).join(', ');
                next(new ValidationException(ErrorMessages.VALIDATION_ERROR_MESSAGE, errorString, errors));
            } else {
                next();
            }
        });
    };
}   