import { Gender, Role, Status, Management, Verify } from '@config/enum';
import { ArrayUnique, IsArray, IsString, IsOptional, IsNumber, IsEnum, MaxLength } from 'class-validator';

export class SignUpCustomerDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  name: string;
  @IsString()
  company_tax_code: string;
  @IsString()
  email: string;
  @IsString()
  phone?: string;
  @IsString()
  gender?: Gender;
  @IsString()
  status?: Status;
  @IsString()
  verify?: Verify;
  @IsString()
  role: Role;
  @IsArray()
  @ArrayUnique((o) => o.management)
  authorities: AuthorityDto[];

  @IsNumber()
  @IsOptional()
  referral_source_id: number;
  @IsNumber()
  @IsOptional()
  company_id: number | null;
}

class AuthorityDto {
  @IsString()
  code: string;
  @IsString()
  @MaxLength(4)
  action: string;
  @IsString()
  @IsEnum(Management)
  management: Management;
}
