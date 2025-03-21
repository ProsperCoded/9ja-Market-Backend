import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MerchantReferrerDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  referrerCode: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  referrerUsername?: string;
}
