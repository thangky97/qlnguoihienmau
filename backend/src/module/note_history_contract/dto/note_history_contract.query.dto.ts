import { Allow, IsOptional } from 'class-validator';
export class NoteHistoryContractQueryDto {
  @Allow()
  @IsOptional()
  id: number;
}
