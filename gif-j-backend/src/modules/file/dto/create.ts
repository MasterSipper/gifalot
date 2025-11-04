import { IsNotEmpty, IsString, Length } from 'class-validator';
import { isSupportedMimeType } from '../file.decorators';

export class FileCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  public filename: string;

  @IsNotEmpty()
  @isSupportedMimeType()
  public mimeType: string;
}
