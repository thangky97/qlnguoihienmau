import { Status, WorkStatus, StatusContract } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString, IsOptional } from 'class-validator';

class FilterContract {
  @IsString()
  status?: StatusContract;
  @IsString()
  workstatus?: WorkStatus;
  @IsNumber()
  jobfield_id?: number;
  @IsNumber()
  @IsOptional()
  inquiry_id?: number;
  @IsString()
  @IsOptional()
  customer_code: string;
  @IsString()
  @IsOptional()
  user_code: string;
}

export class ContractFilterDto {
  @IsObject()
  filter: FilterContract;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
