import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { TransitionType } from 'src/shared/enums';
import { COLLECTION_CONSTANTS } from '../collection.constants';
import { CollectionView } from '../collection.entity';

export class CollectionUpdateDto {
  @IsOptional()
  @IsString()
  @Length(1, 128)
  public name?: string;

  @IsOptional()
  @IsEnum(CollectionView)
  public view?: CollectionView;

  @IsOptional()
  @IsBoolean()
  public private?: boolean;

  @IsOptional()
  @IsPositive()
  public timePerSlide?: number;

  @IsOptional()
  @IsString()
  @IsEnum(TransitionType)
  public transitionType?: TransitionType;

  @IsOptional()
  @IsArray()
  @IsPositive({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(COLLECTION_CONSTANTS.LIMIT_PER_USER)
  public ranks?: number[];
}
