import { Status, WorkStatus, StatusContract, ProcessingStatus } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class ContractDto {
  @IsNumber()
  @IsOptional()
  jobfield_id: number;
  @IsNumber()
  @IsOptional()
  inquiry_id: number;
  @IsString()
  name: string;
  @IsString()
  duration: string;
  @IsString()
  description: string;
  @IsString()
  customer_code: string;
  @IsString()
  contract_number_information: string;
  @IsString()
  user_code: string;
  @IsString()
  signing_date: Date;
  @IsString()
  createDate: Date;
  @IsString()
  note: string;
  @IsString()
  status?: StatusContract;
  @IsString()
  @IsOptional()
  workstatus?: WorkStatus;
  @IsString()
  @IsOptional()
  processingStatus?: ProcessingStatus;

  @IsString()
  @IsOptional()
  file_contract?: string;
}
