import { IsOptional, IsPositive } from 'class-validator';

export class CollectionListDto {
  @IsOptional()
  @IsPositive()
  public lastId?: number;
}
