import { ProcessingStatus } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsObject, IsString } from 'class-validator';

class FilterNoteHistoryInquiry {
  @IsString()
  processingStatus?: ProcessingStatus;
}

export class NoteHistoryInquiryFilterDto {
  @IsObject()
  filter: FilterNoteHistoryInquiry;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
