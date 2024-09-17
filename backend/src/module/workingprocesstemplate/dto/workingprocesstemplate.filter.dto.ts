import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString, IsOptional } from 'class-validator';

class FilterWorkingprocesstemplate {
  @IsString()
  status?: Status;
  @IsNumber()
  jobfield_id?: number;
  @IsNumber()
  department_id?: number;
}

export class WorkingprocesstemplateFilterDto {
  @IsObject()
  filter: FilterWorkingprocesstemplate;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
