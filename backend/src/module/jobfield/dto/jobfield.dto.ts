import { Status } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class JobfieldDto {
  @IsString()
  code: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  status?: Status;
  @IsNumber()
  @IsOptional()
  company_id: number | null;
}
