import { SetMetadata } from '@nestjs/common';
import { Role } from '@config/enum';

export const CheckRole = (roles: Role[]) => SetMetadata('role', roles);
