import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString, IsOptional } from 'class-validator';

class FilterTask {
  @IsString()
  status?: Status;
  @IsNumber()
  jobfield_id?: number;
  @IsNumber()
  job_id?: number;
}

export class TaskFilterDto {
  @IsObject()
  filter: FilterTask;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
