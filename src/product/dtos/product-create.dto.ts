import { $Enums, Prisma } from "@prisma/client";
import { IsDefined, IsIn, IsOptional, IsString } from "class-validator";
import { IsNumberOrNumberString } from "../../constants/decorators/numberOrNumberString.decorator";

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

    @IsOptional()
    @IsNumberOrNumberString()
    declare prevPrice: number;

    @IsDefined()
    @IsNumberOrNumberString()
    declare price: number;

    @IsDefined()
    @IsNumberOrNumberString()
    declare stock: number;

    @IsDefined()    
    @IsString()
    @IsIn(Object.values($Enums.ProductCategory))
    declare category: $Enums.ProductCategory;

    @IsOptional()
    productImages?: Express.Multer.File[];
}