import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class ReferrerCodeDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  referrerCode: string;
}
