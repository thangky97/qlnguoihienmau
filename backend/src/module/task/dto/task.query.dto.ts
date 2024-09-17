import { Status } from '@config/enum';
import { Allow, IsOptional, IsString } from 'class-validator';
export class TaskQueryDto {
  @Allow()
  @IsOptional()
  jobfield_id: number;
  @Allow()
  @IsOptional()
  job_id: number;
  @IsString()
  status?: Status;
}
