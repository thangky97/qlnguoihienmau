import { Verify } from './../../../config/enum';
import { Gender, Role, Status } from '@config/enum';
import { ArrayUnique, IsArray, IsString, IsOptional, IsNumber } from 'class-validator';
import { AuthorityDto } from './authority.dto';

export class UserDto {
  @IsString()
  username: string | null;
  @IsString()
  password: string | null;
  @IsString()
  name: string;
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  address: string;
  @IsNumber()
  @IsOptional()
  department_id: number;
  @IsOptional()
  @IsString()
  company_tax_code: string;
  @IsString()
  phone?: string;
  @IsString()
  gender?: Gender;
  @IsString()
  status?: Status;
  @IsString()
  role: Role;
  @IsOptional()
  @IsString()
  verify?: Verify;
  @IsArray()
  @ArrayUnique((o) => o.management)
  authorities: AuthorityDto[];
  @IsOptional()
  @IsNumber()
  referral_source_id: number | null;
  @IsNumber()
  @IsOptional()
  company_id: number | null;
  @IsNumber()
  @IsOptional()
  branch_id: number | null;
}
