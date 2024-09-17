import { CommonService } from '@module/common/common.service';

import { BranchController } from '@module/branch/branch.controller';
import { Module } from '@nestjs/common';
import { BranchService } from '@module/branch/service/branch.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, BranchService, UsersService],
  exports: [BranchService],
  controllers: [BranchController],
})
export class BranchModule {}
