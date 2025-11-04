import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CollectionCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 128)
  public name: string;

  @IsOptional()
  @IsBoolean()
  public private?: boolean;

  @IsOptional()
  @IsPositive()
  public timePerSlide?: number;
}
