import { Prisma } from "@prisma/client";
import { IsDefined, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class CustomerRegisterRequestDto implements Prisma.CustomerCreateInput{
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
    declare firstName: string;
  
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    declare lastName: string;

    
}