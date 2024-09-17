import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString, IsOptional } from 'class-validator';

class FilterJobfield {
  @IsString()
  status?: Status;
  @IsNumber()
  @IsOptional()
  company_id: number;
}

export class JobfieldFilterDto {
  @IsObject()
  filter: FilterJobfield;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
