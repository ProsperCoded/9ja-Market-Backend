import { IsUUID } from "class-validator";
export class IdDto {
  @IsUUID()
  declare adId: string;
}
