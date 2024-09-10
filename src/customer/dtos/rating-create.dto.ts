import { Prisma } from "@prisma/client";
import { IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RatingCreateDto implements Omit<Prisma.RatingCreateWithoutCustomerInput, "product"> {
    @IsDefined()
    @IsNumber()
    declare rating: number;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    declare review: string;
}