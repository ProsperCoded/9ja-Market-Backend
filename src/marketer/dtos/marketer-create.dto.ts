import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class MarketerCreateDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  accountBank: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  BusinessType: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  marketingExperience?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  IdentityCredentialType: string;
}
