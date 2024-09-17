import { Gender, Role, Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsNumber, IsObject, IsString } from 'class-validator';

class FilterCompany {
  @IsString()
  status?: Status;
}

export class CompanyFilterDto {
  @IsObject()
  filter: FilterCompany;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
