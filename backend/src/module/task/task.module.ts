import { CommonService } from '@module/common/common.service';

import { TaskController } from '@module/task/task.controller';
import { Module } from '@nestjs/common';
import { TaskService } from '@module/task/service/task.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, TaskService, UsersService],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
