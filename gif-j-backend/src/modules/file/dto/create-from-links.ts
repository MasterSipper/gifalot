import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { FILE_CONSTANTS } from '../file.constants';

export class FileCreateFromLinksDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(FILE_CONSTANTS.LINKS_PER_REQUEST)
  @IsString({ each: true })
  @Length(1, 512, { each: true })
  @Matches(FILE_CONSTANTS.FILE_REGEX, {
    each: true,
    message: 'each value in links must match regex',
  })
  public readonly links: string[];
}
