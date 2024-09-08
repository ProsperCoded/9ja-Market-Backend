import { IsDefined, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordRequestDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    declare newPassword: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    declare token: string;
}