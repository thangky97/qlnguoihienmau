import { CommonService } from '@module/common/common.service';

import { WorkingprocesstemplateController } from '@module/workingprocesstemplate/workingprocesstemplate.controller';
import { Module } from '@nestjs/common';
import { WorkingprocesstemplateService } from '@module/workingprocesstemplate/service/workingprocesstemplate.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, WorkingprocesstemplateService, UsersService],
  exports: [WorkingprocesstemplateService],
  controllers: [WorkingprocesstemplateController],
})
export class WorkingprocesstemplateModule {}
