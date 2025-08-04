import {
  IsByteLength,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from "class-validator";

export class ResetPasswordRequestDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  declare newPassword: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsByteLength(6, 6, { message: "Your code is invalid" })
  declare resetCode: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  declare email: string;
}
