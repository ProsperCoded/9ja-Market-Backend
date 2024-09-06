    import { plainToInstance } from "class-transformer";
    import { validate, ValidationError } from "class-validator";
    import { NextFunction, Request, Response } from "express";
import { ValidationException } from "../exceptions/validation.exception";


    export function validateBody<T>(schema: any) {
        return (request: Request, response: Response, next: NextFunction) => {
            validate(plainToInstance(schema, request.body), { skipMissingProperties: true }).then(errors => {
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => Object.values(error.constraints!)).join(', ');
                    next(new ValidationException(message));
                } else {
                    next();
                }
            });
        };
    }   