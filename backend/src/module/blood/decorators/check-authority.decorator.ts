import { Management } from '@config/enum';
import { SetMetadata } from '@nestjs/common';

export const CheckAuthority = (management: Management, action: string) => SetMetadata('authority', { management, action });
