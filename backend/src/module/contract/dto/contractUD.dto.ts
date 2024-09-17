import { Status, WorkStatus, StatusContract, ProcessingStatus } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class ContractUDDto {
  @IsString()
  customer_code: string;
  @IsString()
  contract_number_information: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  jobfield_id: number;
  @IsNumber()
  @IsOptional()
  inquiry_id: number;
  @IsString()
  createDate: Date;
  @IsString()
  user_code: string;
  @IsString()
  @IsOptional()
  workstatus: WorkStatus;
  @IsString()
  note: string;
  @IsString()
  status?: StatusContract;
  @IsString()
  @IsOptional()
  processingStatus?: ProcessingStatus;

  @IsString()
  @IsOptional()
  file_contract?: string;
  
}
