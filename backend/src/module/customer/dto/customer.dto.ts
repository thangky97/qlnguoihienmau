import { Status } from '@config/enum';
import { IsString, IsOptional, IsNumber } from 'class-validator';
export class CustomerDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  tax_code: string;
  @IsOptional()
  @IsString()
  address: string;
  @IsOptional()
  @IsString()
  email: string;
  @IsString()
  phone?: string;
  @IsString()
  status?: Status;
  @IsString()
  loaiHinh?: string;
  @IsNumber()
  @IsOptional()
  company_id: number | null;
  @IsNumber()
  @IsOptional()
  branch_id: number | null;

  @IsString()
  date_birthday: Date;

  @IsString()
  weight: string;

  @IsString()
  height: string;

  @IsOptional()
  @IsString()
  nhommau: string;

  @IsOptional()
  @IsString()
  huyetap: string;

  @IsOptional()
  @IsString()
  hemoglobin: string;

  @IsOptional()
  @IsString()
  tinhtrangbenhly: string;

  @IsOptional()
  @IsString()
  tieususdthuoc: string;

  @IsOptional()
  @IsString()
  duchitieuhien: string;

  @IsOptional()
  @IsString()
  luongmauhien: string;

  @IsOptional()
  @IsString()
  password: string;
}
