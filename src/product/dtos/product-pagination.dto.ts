import { $Enums } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, Min, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ProductPaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize?: number = 40;

  @IsOptional()
  @IsEnum($Enums.ProductCategory)
  category?: $Enums.ProductCategory;

  @IsOptional()
  @IsString()
  state?: string;
}
