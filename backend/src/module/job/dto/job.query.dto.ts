import { Status } from '@config/enum';
import { Allow, IsOptional, IsString } from 'class-validator';
export class JobQueryDto {
  @Allow()
  @IsOptional()
  jobfield_id: number;
  @Allow()
  @IsOptional()
  customer_code: string;
  @IsString()
  status?: Status;
}
