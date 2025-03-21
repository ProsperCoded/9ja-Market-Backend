import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MarketerUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accountName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accountBank?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  BusinessType?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  marketingExperience?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  IdentityCredentialType?: string;
}
