import { Gender, Role, Status } from '@config/enum';
import { ArrayUnique, IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class BloodDto {
  @IsString()
  transactionCodes: string;

  @IsNumber()
  bloodtype: number;

  @IsOptional()
  @IsString()
  transactionDate: string;

  @IsNumber()
  hospital_id: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  status?: Status;
}
