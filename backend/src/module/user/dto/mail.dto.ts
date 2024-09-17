import { IsString } from 'class-validator';

export class MailDto {
  @IsString()
  name: string;
  @IsString()
  title: string;
  @IsString()
  text_message: string;
  @IsString()
  send_time: string;
}
