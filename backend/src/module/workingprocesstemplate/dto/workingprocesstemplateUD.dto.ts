import { Status } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class WorkingprocesstemplateUDDto {
  @IsString()
  name: string;
  @IsNumber()
  jobfield_id: number;
  @IsNumber()
  department_id: number;
  @IsNumber()
  @IsOptional()
  prev_task_id: number;
  @IsNumber()
  sequence: number;
  @IsNumber()
  limitdays: number;
  @IsString()
  status?: Status;
}
