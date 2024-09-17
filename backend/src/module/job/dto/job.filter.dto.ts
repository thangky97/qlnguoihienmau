import { Status, WorkStatusTask } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString, IsOptional } from 'class-validator';

class FilterJob {
  @IsString()
  status?: Status;
  @IsString()
  workstatusJob?: WorkStatusTask;
  @IsNumber()
  jobfield_id?: number;
  @IsNumber()
  contract_id?: number;
  @IsString()
  @IsOptional()
  user_code: string;
}

export class JobFilterDto {
  @IsObject()
  filter: FilterJob;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
