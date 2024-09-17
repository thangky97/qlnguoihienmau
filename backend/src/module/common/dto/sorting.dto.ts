import { SortType } from '@config/enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SortingDto {
  @IsString()
  @IsNotEmpty()
  sortBy: string;

  @IsEnum(SortType)
  sortDirection: SortType;
}
