import { ProcessingStatus } from '@config/enum';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class NoteHistoryInquiryDto {
  @IsNumber()
  id: number;
  @IsString()
  @IsOptional()
  processingStatus: string;
  @IsString()
  @IsOptional()
  note: string;
}
