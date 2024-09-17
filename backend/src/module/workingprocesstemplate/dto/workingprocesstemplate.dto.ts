import { Status } from '@config/enum';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class WorkingprocesstemplateDto {
  @IsString()
  name: string;
  @IsNumber()
  @IsOptional()
  jobfield_id: number;
  @IsNumber()
  @IsOptional()
  department_id: number;
  @IsNumber()
  sequence: number;
  @IsNumber()
  limitdays: number;
  @IsNumber()
  @IsOptional()
  prev_task_id: number;
  @IsString()
  status?: Status;
}
