import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { REGEX_FULLNAME_USER } from '@config/regex';

export class SignUpDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(REGEX_FULLNAME_USER)
  @MinLength(8)
  @MaxLength(32)
  fullname: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsEmail()
  email: string;
}
