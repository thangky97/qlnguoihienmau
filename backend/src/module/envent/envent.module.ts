import { CommonService } from '@module/common/common.service';

import { EnventController } from '@module/envent/envent.controller';
import { Module } from '@nestjs/common';
import { EnventService } from '@module/envent/service/envent.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, EnventService, UsersService],
  exports: [EnventService],
  controllers: [EnventController],
})
export class EnventModule {}
