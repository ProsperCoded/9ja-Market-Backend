import { HttpStatus } from "../../constants/http-status.enum";
import { BaseException } from "./base.exception";

export class ValidationException extends BaseException {
    readonly errors: any;
    readonly errorString?: string;
    constructor(message: string, errorString?: string,  errors?: any) {
        super(message);
        this.status = HttpStatus.FORBIDDEN;
        this.reason = "Validation Error";
        this.errorString = errorString;
        this.errors = errors;
    }
}