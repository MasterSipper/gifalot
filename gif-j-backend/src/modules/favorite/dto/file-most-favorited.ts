import { IsOptional, IsPositive, Max } from 'class-validator';

export class FavoriteFileMostFavoritedDto {
  @IsOptional()
  @IsPositive()
  @Max(100)
  public page?: number;
}
