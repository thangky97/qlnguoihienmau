import { Allow, IsOptional } from 'class-validator';
export class JobfieldQueryDto {
  @Allow()
  @IsOptional()
  company_id: number;
}
