import { IsNumber, IsString } from 'class-validator';

export class NoteHistoryContractUDDto {
  @IsNumber()
  id: number;
  @IsString()
  processingStatus?: string;
  @IsString()
  note: string;
}
