import { CommonService } from '@module/common/common.service';

import { InquiryController } from '@module/inquiry/inquiry.controller';
import { Module } from '@nestjs/common';
import { InquiryService } from '@module/inquiry/service/inquiry.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, InquiryService, UsersService],
  exports: [InquiryService],
  controllers: [InquiryController],
})
export class InquiryModule {}
