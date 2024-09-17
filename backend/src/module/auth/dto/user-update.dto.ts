import { Gender } from '@config/enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { REGEX_FULLNAME_USER } from '@config/regex';

export class UserUpdateDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(REGEX_FULLNAME_USER)
  @MinLength(8)
  @MaxLength(32)
  fullname: string;

  @IsOptional()
  @ValidateIf((o) => !!o.phone_number)
  @IsPhoneNumber()
  phone_number?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
