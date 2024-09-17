import { Status } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class BranchUDDto {
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
  status?: Status;
  @IsNumber()
  @IsOptional()
  company_id: number | null;
}
