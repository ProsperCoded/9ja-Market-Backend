import { $Enums, Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsEmail, IsIn, IsNotEmpty, IsString, IsStrongPassword, ValidateNested } from "class-validator";
import { AddressCreateDto } from "../../../../dtos/address-create.dto";

interface MarketCreateInput extends Omit<Prisma.MarketCreateInput, "phoneNumbers" | "addresses"> {
    phoneNumbers?: string[];
    addresses?: AddressCreateDto[];
}

export class MarketRegisterRequestDto implements MarketCreateInput {
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

    @IsDefined()
    @IsArray()
    @IsString({ each: true })
    @IsIn(Object.values($Enums.MarketCategory), { each: true })
    declare marketCategories?: $Enums.MarketCategory[];

    @IsArray()
    @IsString({ each: true })
    declare phoneNumbers?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressCreateDto)
    declare addresses?: AddressCreateDto[];
}