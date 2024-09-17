import { Management } from '@config/enum';
import { IsEnum, IsString, MaxLength } from 'class-validator';

export class AuthorityDto {
  @IsString()
  code: string;
  @IsString()
  @MaxLength(4)
  action: string;
  @IsString()
  @IsEnum(Management)
  management: Management;
}
