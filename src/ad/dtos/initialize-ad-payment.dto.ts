import { IsDefined, IsNumberString, IsUUID, Matches } from "class-validator";

export class InitializeAdPaymentDto{
    @IsDefined()
    @IsNumberString()
    @Matches(/^[1-3]$/, { message: 'Level must be a number between 1 and 3' })
    declare level : string;

    @IsDefined()
    @IsUUID()
    declare productId : string;
}