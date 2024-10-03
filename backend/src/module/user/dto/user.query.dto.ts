import { Status, Verify } from '@config/enum';
import { Allow, IsOptional } from 'class-validator';
export class UserQueryDto {
  @Allow()
  @IsOptional()
  status: Status;
}

export class UserQueryCustomerDto {
  @Allow()
  @IsOptional()
  status: Status;
}
