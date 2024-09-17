import { Status, WorkStatusTask } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class TaskUDDto {
  @IsNumber()
  job_id: number;
  @IsNumber()
  department_id: number;
  @IsNumber()
  jobfield_id: number;
  @IsString()
  taskname: string;
  @IsString()
  description: string;
  @IsString()
  note: string;
  @IsNumber()
  dealine: number;
  @IsString()
  processDate: Date;
  @IsString()
  createDate: Date;
  @IsString()
  endDate: Date;
  @IsNumber()
  @IsOptional()
  sequence: number;
  @IsString()
  workstatus: WorkStatusTask;
  @IsString()
  status?: Status;
}
