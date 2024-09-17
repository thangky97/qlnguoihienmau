import { inquiryProcessingStatus, ProcessingStatus, Status } from '@config/enum';
import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class InquiryDto {
  @IsNumber()
  @IsOptional()
  jobfield_id: number;
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  description: string;
  @IsString()
  note: string;
  @IsString()
  customer_code: string;
  @IsString()
  status?: Status;
  @IsString()
  processingStatus?: string;
  @IsNumber()
  @IsOptional()
  company_id: number | null;

  @IsOptional() // Since the date will default to the current timestamp, this can be optional
  inquiry_date?: Date; // Use '?' to indicate that this field is optional
}
