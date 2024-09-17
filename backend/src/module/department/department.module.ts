import { CommonService } from '@module/common/common.service';

import { DepartmentController } from '@module/department/department.controller';
import { Module } from '@nestjs/common';
import { DepartmentService } from '@module/department/service/department.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, DepartmentService, UsersService],
  exports: [DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
