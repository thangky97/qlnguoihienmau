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
  @IsString()
  phone?: string;
  @IsString()
  status?: Status;
  @IsString()
  role: Role;
  @IsArray()
  @ArrayUnique((o) => o.management)
  authorities: AuthorityDto[];
}
