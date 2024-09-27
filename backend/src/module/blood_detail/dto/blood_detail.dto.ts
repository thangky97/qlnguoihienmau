import { Status } from '@config/enum';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BloodDetailDto {
  @IsString()
  transactionCode: string;

  @IsOptional()
  @IsString()
  bloodName: string;

  @IsOptional()
  @IsNumber()
  qty: number;

  @IsNumber()
  hospital_id: number;

  @IsString()
  status?: Status;
}
