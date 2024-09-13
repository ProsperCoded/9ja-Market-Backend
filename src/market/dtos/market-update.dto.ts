import { Prisma } from "@prisma/client";
import { AddressCreateDto } from "../../dtos/address-create.dto";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

interface MarketUpdateInput extends Omit<Prisma.MarketUpdateInput, "phoneNumbers" | "addresses"> {
    phoneNumbers?: string[];
    addresses?: AddressCreateDto[];
}

export class MarketUpdateDto implements MarketUpdateInput{
    @IsString()
    @IsNotEmpty()
    brandName?: string | Prisma.StringFieldUpdateOperationsInput | undefined;

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(2, { message: 'phoneNumbers must contain 2 elements' })
    @ArrayMaxSize(2, { message: 'phoneNumbers must contain 2 elements' })
    phoneNumbers?: string[] | undefined;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressCreateDto)
    addresses?: AddressCreateDto[];
}