import { Gender, Role, Status } from '@config/enum';
import { ArrayUnique, IsArray, IsNumber, IsString } from 'class-validator';

export class CompanyUDDto {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsString()
  description: string;
  @IsString()
  contactmobile: string;
  @IsString()
  phonezalo: string;
  @IsString()
  linkfb: string;
  @IsString()
  contactemail: string;
  @IsString()
  langname: string;
  @IsString()
  status?: Status;
}
