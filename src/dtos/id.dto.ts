import { IsDefined, IsString, IsUUID } from "class-validator";

export class IdDto{
    @IsDefined()
    @IsString()
    @IsUUID()
    declare id: string;
}