import { CommonService } from '@module/common/common.service';

import { JobController } from '@module/job/job.controller';
import { Module } from '@nestjs/common';
import { JobService } from '@module/job/service/job.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, JobService, UsersService],
  exports: [JobService],
  controllers: [JobController],
})
export class JobModule {}
