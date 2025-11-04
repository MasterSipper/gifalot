import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
