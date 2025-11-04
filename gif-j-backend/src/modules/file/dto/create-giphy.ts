import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
  Length,
} from 'class-validator';
import { FILE_CONSTANTS } from '../file.constants';

export class FileCreateGiphyDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(FILE_CONSTANTS.GIPHY_PER_REQUEST)
  @IsString({ each: true })
  @Length(1, 32, { each: true })
  public ids: string[];
}
