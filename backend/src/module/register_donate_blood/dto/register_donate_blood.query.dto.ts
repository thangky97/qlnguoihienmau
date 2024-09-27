import { Allow, IsOptional } from 'class-validator';
export class RegisterDonateBloodQueryDto {
  @Allow()
  @IsOptional()
  id: number;
}
