import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsObject, IsString, IsNumber, IsOptional } from 'class-validator';

class FilterCustomer {
  @IsString()
  address: string;
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  phone?: string;
  @IsString()
  date_birthday: Date;
  @IsString()
  status?: Status;
  @IsNumber()
  @IsOptional()
  company_id: number;
}

export class CustomerFilterDto {
  @IsObject()
  filter: FilterCustomer;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
