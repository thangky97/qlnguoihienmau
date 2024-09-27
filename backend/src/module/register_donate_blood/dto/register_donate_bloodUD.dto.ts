import { IsNumber, IsString } from 'class-validator';

export class RegisterDonateBloodUDDto {
  @IsNumber()
  id: number;
  @IsString()
  processingStatus?: string;
  @IsString()
  note: string;
}
