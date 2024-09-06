import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailRequestDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  declare token: string;
}