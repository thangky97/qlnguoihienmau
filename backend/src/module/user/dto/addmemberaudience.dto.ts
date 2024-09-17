import { IsString } from 'class-validator';

export class AddMemberToAudienceDto {
  @IsString()
  email: string;
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
}
