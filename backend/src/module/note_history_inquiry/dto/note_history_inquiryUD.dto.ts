import { ProcessingStatus } from '@config/enum';
import { IsNumber, IsString } from 'class-validator';

export class NoteHistoryInquiryUDDto {
  @IsNumber()
  id: number;
  @IsString()
  processingStatus?: ProcessingStatus;
  @IsString()
  note: string;
}
