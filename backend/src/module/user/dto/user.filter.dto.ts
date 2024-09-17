import { Gender, Role, Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsObject, IsString, IsNumber, IsOptional } from 'class-validator';

class FilterUser {
  @IsString()
  username: string;
  @IsString()
  address: string;
  @IsString()
  name: string;
  @IsString()
  phone?: string;
  @IsString()
  gender?: Gender;
  @IsString()
  status?: Status;
  @IsString()
  role: Role;
  @IsNumber()
  @IsOptional()
  company_id: number;
  @IsNumber()
  @IsOptional()
  department_id: number;
}

export class UserFilterDto {
  @IsObject()
  filter: FilterUser;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
