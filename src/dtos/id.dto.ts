import { IsDefined, IsString, IsUUID } from "class-validator";

export class IdDto{
    @IsDefined()
    @IsString({message: "The Id you provided is not a valid string"})
    @IsUUID(undefined, {message: "The Id you provided is invalid"})
    declare id: string;
}