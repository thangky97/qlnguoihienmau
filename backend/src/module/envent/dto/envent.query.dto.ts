import { Allow, IsOptional } from 'class-validator';
export class EnventQueryDto {
  @Allow()
  @IsOptional()
  company_id: number;
}
