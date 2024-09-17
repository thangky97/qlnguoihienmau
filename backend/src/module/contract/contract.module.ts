import { CommonService } from '@module/common/common.service';

import { ContractController } from '@module/contract/contract.controller';
import { Module } from '@nestjs/common';
import { ContractService } from '@module/contract/service/contract.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, ContractService, UsersService],
  exports: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
