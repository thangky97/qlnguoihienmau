import { Status, StatusContract, WorkStatusTask } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class JobUDDto {
  @IsNumber()
  @IsOptional()
  contract_id: number;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  user_code: string;
  @IsNumber()
  jobfield_id: number;
  @IsString()
  status?: StatusContract;
  @IsString()
  workstatusJob?: WorkStatusTask;
  @IsString()
  createDate: Date;
  @IsString()
  jobDate: Date;
}
