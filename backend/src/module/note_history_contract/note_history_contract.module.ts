import { CommonService } from '@module/common/common.service';

import { NoteHistoryContractController } from '@module/note_history_contract/note_history_contract.controller';
import { Module } from '@nestjs/common';
import { NoteHistoryContractService } from '@module/note_history_contract/service/note_history_contract.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, NoteHistoryContractService, UsersService],
  exports: [NoteHistoryContractService],
  controllers: [NoteHistoryContractController],
})
export class NoteHistoryContractModule {}
