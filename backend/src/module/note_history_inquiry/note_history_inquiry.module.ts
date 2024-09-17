import { CommonService } from '@module/common/common.service';

import { NoteHistoryInquiryController } from '@module/note_history_inquiry/note_history_inquiry.controller';
import { Module } from '@nestjs/common';
import { NoteHistoryInquiryService } from '@module/note_history_inquiry/service/note_history_inquiry.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, NoteHistoryInquiryService, UsersService],
  exports: [NoteHistoryInquiryService],
  controllers: [NoteHistoryInquiryController],
})
export class NoteHistoryInquiryModule {}
