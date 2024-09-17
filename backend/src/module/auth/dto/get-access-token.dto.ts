import { IsJWT } from 'class-validator';

export class GetAccessTokenDto {
  @IsJWT()
  refresh_token: string;
}
