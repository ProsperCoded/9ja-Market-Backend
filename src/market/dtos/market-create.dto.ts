import { Prisma } from "@prisma/client";
import {
  IsBoolean,
  IsBooleanString,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Transform } from "stream";

export class MarketCreateDto
  implements Omit<Prisma.MarketCreateInput, "isMall">
{
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  declare address: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  declare description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  declare city: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  declare state: string;

  @IsOptional()
  @IsBoolean()
  declare isMall: "true" | "false";
}
