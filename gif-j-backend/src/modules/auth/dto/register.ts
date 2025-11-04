import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  public password: string;
}
