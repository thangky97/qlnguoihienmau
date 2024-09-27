import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterDonateBloodDto {
  @IsNumber()
  id: number;
  @IsString()
  @IsOptional()
  processingStatus: string;
  @IsString()
  @IsOptional()
  note: string;
}
