import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { AUTH_CONSTANTS } from '../auth.constants';

export class AuthResetPasswordConfirmDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  public password: string;

  @IsNotEmpty()
  @IsString()
  @Length(
    AUTH_CONSTANTS.RESET_PASSWORD_CODE_LENGTH,
    AUTH_CONSTANTS.RESET_PASSWORD_CODE_LENGTH,
  )
  public code: string;
}
