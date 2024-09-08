import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ValidationException } from "../exceptions/validation.exception";

enum ValidationErrorMessages {
    body = "There was an error with the request body",
    query = "There was an error with the query parameters",
    params = "There was an error with the request parameters"
}

interface IValidation {
    schema: any;
    scope?: keyof typeof ValidationErrorMessages;
}

export class Validator {
    constructor(public readonly scope: string) { }

    single(schema: any, scope: keyof typeof ValidationErrorMessages = 'body') {
        return (request: Request, response: Response, next: NextFunction) => {
            validate(plainToInstance(schema, request[scope]), { skipMissingProperties: true }).then(errors => {
                if (errors.length > 0) {
                    const errorArray = errors.map((error: ValidationError) => Object.values(error.constraints!));
                    const errorString = errorArray.join(', ');
                    next(new ValidationException(ValidationErrorMessages[scope], errorString, errorArray));
                } else {
                    next();
                }
            });
        };
    }

    multiple(args: IValidation[]) {
        return (request: Request, response: Response, next: NextFunction) => {
            args.forEach(({ schema, scope = 'body' }) => {
                validate(plainToInstance(schema, request[scope]), { skipMissingProperties: true }).then(errors => {
                    if (errors.length > 0) {
                        const errorArray = errors.map((error: ValidationError) => Object.values(error.constraints!));
                        const errorString = errorArray.join(', ');
                        next(new ValidationException(ValidationErrorMessages[scope], errorString, errorArray));
                    }
                });
            });
            next();
        };
    }
}