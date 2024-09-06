import { Prisma } from "@prisma/client";
import { IsDefined, IsString } from "class-validator";

export class AddressCreateDto implements Prisma.AddressCreateInput{
    @IsDefined()
    @IsString()
    declare address: string;

    @IsDefined()
    @IsString()
    declare city: string;

    @IsDefined()
    @IsString()
    declare state: string;

    @IsDefined()
    @IsString()
    declare country: string;

    @IsString()
    declare zipCode: string;

    @IsString()
    declare postalCode?: string;
}