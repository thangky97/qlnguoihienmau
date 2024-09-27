import { Status } from '@config/enum';
import { IsString } from 'class-validator';

export class HospitalDto {
  @IsString()
  name: string;
  @IsString()
  phone: string;
  @IsString()
  email: string;
  @IsString()
  address: string;
  @IsString()
  description: string;
  @IsString()
  status?: Status;
}
