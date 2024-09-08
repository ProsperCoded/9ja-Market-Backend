import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordRequestDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    declare newPassword: string;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    declare resetCode: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    declare email: string;
}