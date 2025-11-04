import { IsDateString, IsOptional } from 'class-validator';

export class CollectionListPublicDto {
  @IsOptional()
  @IsDateString()
  public date?: string;
}
