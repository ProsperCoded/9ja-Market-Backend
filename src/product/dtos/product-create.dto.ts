import { $Enums, Prisma } from "@prisma/client";
import { IsArray, IsDefined, IsIn, IsNumber, IsString } from "class-validator";

interface IProductCreateDto extends Omit<Prisma.ProductCreateInput, "displayImages" | "displayImage" | "merchant"> {}

export class ProductCreateDto implements IProductCreateDto {
    @IsDefined()
    @IsString()
    declare name: string;

    @IsDefined()
    @IsString()
    declare details: string;

    @IsDefined()
    @IsString()
    declare description: string;

    @IsDefined()
    @IsNumber()
    declare prevPrice: number;

    @IsDefined()
    @IsNumber()
    declare price: number;

    @IsDefined()
    @IsNumber()
    declare stock: number;

    @IsDefined()
    @IsArray()
    @IsString({ each: true })
    @IsIn(Object.values($Enums.ProductCategory), { each: true })
    declare category: $Enums.ProductCategory;
}