import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

class FilterBloodDetail {
  @IsString()
  status?: Status;

  @IsOptional()
  @IsString()
  transactionCode: string;

  @IsOptional()
  @IsNumber()
  bloodtype: number;

  @IsOptional()
  @IsString()
  materialCode: string;
}

export class BloodDetailFilterDto {
  @IsObject()
  filter: FilterBloodDetail;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
