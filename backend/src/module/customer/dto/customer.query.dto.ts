import { Status } from '@config/enum';
import { Allow, IsOptional } from 'class-validator';
export class CustomerQueryDto {
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
}
