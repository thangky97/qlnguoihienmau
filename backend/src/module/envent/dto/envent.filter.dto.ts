import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString, IsOptional } from 'class-validator';

class FilterEnvent {
  @IsString()
  status?: Status;
  @IsString()
  name?: string;
}

export class EnventFilterDto {
  @IsObject()
  filter: FilterEnvent;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
