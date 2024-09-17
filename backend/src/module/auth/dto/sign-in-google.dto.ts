import { IsEmail, IsString } from 'class-validator';

export class SignInGoogleDto {
  @IsEmail()
  @IsString()
  google_email: string;

  @IsString()
  google_id: string;

  @IsString()
  google_last_name: string;
}
