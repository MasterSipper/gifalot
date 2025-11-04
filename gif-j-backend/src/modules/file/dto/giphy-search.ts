import { IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class FileGiphySearchDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 256)
  public q: string;

  @IsNotEmpty()
  @Min(0)
  @Max(4999)
  public offset: number;

  @IsNotEmpty()
  @Min(0)
  @Max(100)
  public limit: number;
}
