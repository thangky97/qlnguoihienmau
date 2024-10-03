import { Gender } from '@config/enum';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UserProfileDto {
  @IsString()
  name: string;
  @IsString()
  phone?: string;
  @IsString()
  gender?: Gender;
  @IsString()
  email?: string;
  @IsString()
  @IsOptional()
  password: string;
  @IsString()
  @IsOptional()
  avatar: string;
}
