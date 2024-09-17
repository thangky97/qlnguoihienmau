import { ProcessingStatus, Status } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class InquiryUDDto {
  @IsNumber()
  jobfield_id: number;
  @IsString()
  customer_code: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  note: string;
  @IsString()
  status?: Status;
  @IsString()
  @IsOptional()
  processingStatus:string ;
  @IsNumber()
  @IsOptional()
  company_id: number | null;
}
