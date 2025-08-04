import { $Enums, Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
  ValidateNested,
} from "class-validator";
import { AddressCreateDto } from "../../dtos/address-create.dto";

interface MerchantCreateInput
  extends Omit<
    Prisma.MerchantCreateInput,
    "phoneNumbers" | "addresses" | "market"
  > {
  phoneNumbers?: string[];
  addresses?: AddressCreateDto[];
  marketName: string;
}

export class MerchantRegisterRequestDto implements MerchantCreateInput {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  declare email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  declare password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  declare brandName: string;

  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  @IsIn(Object.values($Enums.ProductCategory), { each: true })
  declare merchantCategories?: $Enums.ProductCategory[];

  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2, { message: "phoneNumbers must contain 2 elements" })
  @ArrayMaxSize(2, { message: "phoneNumbers must contain 2 elements" })
  declare phoneNumbers: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressCreateDto)
  declare addresses: AddressCreateDto[];

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  declare marketName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  declare referrerCode?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  declare referrerUsername?: string;
}
