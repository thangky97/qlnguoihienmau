import { Status } from '@config/enum';
import { IsString } from 'class-validator';

export class HospitalUDDto {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  phone: string;
  @IsString()
  address: string;
  @IsString()
  description: string;
  @IsString()
  status?: Status;
}
