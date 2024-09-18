import { Status } from '@config/enum';
import { IsString } from 'class-validator';

export class CategoryPostDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  status?: Status;
}
