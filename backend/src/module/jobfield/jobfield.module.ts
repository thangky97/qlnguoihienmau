import { CommonService } from '@module/common/common.service';

import { JobfieldController } from '@module/jobfield/jobfield.controller';
import { Module } from '@nestjs/common';
import { JobfieldService } from '@module/jobfield/service/jobfield.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, JobfieldService, UsersService],
  exports: [JobfieldService],
  controllers: [JobfieldController],
})
export class JobfieldModule {}
