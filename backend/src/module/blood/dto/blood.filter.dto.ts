import { Gender, Role, Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString, IsOptional } from 'class-validator';

class filterBlood {
  @IsString()
  transactionCodes: string;
  @IsString()
  status?: Status;
}

export class BloodFilterDto {
  @IsObject()
  filter: filterBlood;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
