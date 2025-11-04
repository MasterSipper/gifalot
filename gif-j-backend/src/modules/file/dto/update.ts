import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { TransitionType } from 'src/shared/enums';

export class FileUpdateDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  public name?: string;

  @IsOptional()
  @IsPositive()
  public timePerSlide?: number;

  @IsOptional()
  @IsString()
  @IsEnum(TransitionType)
  public transitionType?: TransitionType;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  public rotation?: string;
}
