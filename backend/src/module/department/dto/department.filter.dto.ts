import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString, IsOptional } from 'class-validator';

class FilterDepartment {
  @IsString()
  status?: Status;
  @IsString()
  name?: string;
  @IsNumber()
  @IsOptional()
  company_id: number;
}

export class DepartmentFilterDto {
  @IsObject()
  filter: FilterDepartment;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
