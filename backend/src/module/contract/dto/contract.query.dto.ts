import { Status, WorkStatus, StatusContract } from '@config/enum';
import { Allow, IsOptional, IsString } from 'class-validator';
export class ContractQueryDto {
  @Allow()
  @IsOptional()
  jobfield_id: number;
  @Allow()
  @IsOptional()
  customer_code: string;
  @Allow()
  @IsOptional()
  user_code: string;
  @IsString()
  workstatus?: WorkStatus;
  @IsString()
  status?: StatusContract;
}
