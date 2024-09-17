import { Allow, IsOptional } from 'class-validator';
export class NoteHistoryInquiryQueryDto {
  @Allow()
  @IsOptional()
  id: number;
}
