import { IsDateString, IsOptional } from 'class-validator';

export class FavoriteFileListDto {
  @IsOptional()
  @IsDateString()
  public date?: string;
}
