import { IsUUID } from "class-validator";
export class ProductIdDto {
  @IsUUID()
  declare productId: string;
}
