import { Status } from '@config/enum';
import { PagingDto } from '@module/common/dto/paging.dto';
import { SortingDto } from '@module/common/dto/sorting.dto';
import { IsObject, IsString } from 'class-validator';

class FilterCategoryPost {
  @IsString()
  status?: Status;
  @IsString()
  name?: string;
}

export class CategoryPostFilterDto {
  @IsObject()
  filter: FilterCategoryPost;
  @IsObject()
  sort: SortingDto;
  @IsObject()
  page: PagingDto;
}
