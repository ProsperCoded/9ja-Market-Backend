import { IsEmail, IsString, MinLength } from "class-validator";

export class AdminRegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(8)
  password: string;
}
