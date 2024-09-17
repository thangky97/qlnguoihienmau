import { Status } from '@config/enum';
import { Allow, IsOptional, IsString } from 'class-validator';
export class WorkingprocesstemplateQueryDto {
  @Allow()
  @IsOptional()
  jobfield_id: number;
  @IsString()
  status?: Status;
}
