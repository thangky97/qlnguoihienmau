import { IsInt, Min } from 'class-validator';

export class PagingDto {
  @IsInt()
  @Min(1)
  limit: number;

  @IsInt()
  @Min(1)
  page: number;
}
