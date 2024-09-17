import { Status, Verify } from '@config/enum';
import { Allow, IsOptional } from 'class-validator';
export class UserQueryDto {
  @Allow()
  @IsOptional()
  company_id: number;

  @Allow()
  @IsOptional()
  status: Status;
}

export class UserQueryCustomerDto {
  @Allow()
  @IsOptional()
  status: Status;

  @Allow()
  @IsOptional()
  verify: Verify;
}
