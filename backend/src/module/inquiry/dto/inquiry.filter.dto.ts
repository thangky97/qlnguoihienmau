import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString, IsOptional } from 'class-validator';

class FilterInquiry {
  @IsString()
  status?: Status;
  @IsNumber()
  jobfield_id?: number;
  @IsString()
  @IsOptional()
  customer_code: string;
  @IsNumber()
  @IsOptional()
  company_id: number;
}

export class InquiryFilterDto {
  @IsObject()
  filter: FilterInquiry;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
