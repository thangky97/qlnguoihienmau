import { Status } from '@config/enum';
import { IsString } from 'class-validator';

export class CategoryPostUDDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  status?: Status;
}
