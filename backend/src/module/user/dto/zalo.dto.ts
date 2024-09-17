import { IsString } from 'class-validator';

export class ZaloDto {
  @IsString()
  user_id: string;
  @IsString()
  customer_id: string;
  @IsString()
  text_message: string;
  @IsString()
  trans_message: string;
  @IsString()
  phone_number: string;
  @IsString()
  customer_name: string;
  @IsString()
  company_name: string;
  @IsString()
  program_name: string;
  @IsString()
  program_detail: string;
  @IsString()
  program_condition: string;
}
