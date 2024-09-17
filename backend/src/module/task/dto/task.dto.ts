import { Status, WorkStatusTask } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class TaskDto {
  @IsNumber()
  job_id: number;
  @IsNumber()
  jobfield_id: number;
  @IsNumber()
  department_id: number;
  @IsString()
  taskname: string;
  @IsString()
  description: string;
  @IsNumber()
  dealine: number;
  @IsString()
  processDate: Date;
  @IsString()
  createDate: Date;
  @IsString()
  endDate: Date;
  @IsString()
  note: string;
  @IsNumber()
  @IsOptional()
  sequence: number;
  @IsString()
  workstatus: WorkStatusTask;
  @IsString()
  status?: Status;
}
