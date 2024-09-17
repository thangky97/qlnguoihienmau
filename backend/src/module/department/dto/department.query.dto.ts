import { Allow, IsOptional } from 'class-validator';
export class DepartmentQueryDto {
  @Allow()
  @IsOptional()
  company_id: number;
}
