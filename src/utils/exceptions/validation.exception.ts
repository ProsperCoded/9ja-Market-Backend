import { HttpStatus } from "../../constants/http-status.enum";
import { BaseException } from "./base.exception";

export class ValidationException extends BaseException {
    constructor(message: string, ) {
        super(message);
        this.status = HttpStatus.FORBIDDEN;
        this.reason = "Validation Error";
    }
}