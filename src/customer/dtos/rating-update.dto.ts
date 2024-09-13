import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class RatingUpdateDto implements Prisma.RatingUpdateInput {
    @IsNumber()
    rating?: number;
  
    @IsString()
    @IsNotEmpty()
    review?: string;
  }