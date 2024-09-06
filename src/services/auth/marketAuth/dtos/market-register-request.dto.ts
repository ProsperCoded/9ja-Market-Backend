import { Prisma } from "@prisma/client";
import { IsDefined, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class MarketRegisterRequestDto implements Prisma.MarketCreateInput{
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    declare email: string;
  
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    declare password: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    declare brandName: string;
}