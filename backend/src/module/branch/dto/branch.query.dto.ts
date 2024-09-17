import { Allow, IsOptional } from 'class-validator';
export class BranchQueryDto {
  @Allow()
  @IsOptional()
  company_id: number;
}
