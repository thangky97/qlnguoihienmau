import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsObject, IsString } from 'class-validator';

class FilterRegisterDonateBlood {
  @IsString()
  status?: Status;
  @IsString()
  name?: string;
}

export class RegisterDonateBloodFilterDto {
  @IsObject()
  filter: FilterRegisterDonateBlood;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
