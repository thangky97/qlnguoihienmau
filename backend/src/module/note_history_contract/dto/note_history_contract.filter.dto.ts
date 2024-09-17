import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsObject, IsString } from 'class-validator';

class FilterNoteHistoryContract {
  @IsString()
  processingStatus?: string;
}

export class NoteHistoryContractFilterDto {
  @IsObject()
  filter: FilterNoteHistoryContract;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
