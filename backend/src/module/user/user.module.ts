import { CommonService } from '@module/common/common.service';
import { UserController } from '@module/user/user.controller';
import { Module } from '@nestjs/common';
import { UsersService } from './service/user.service';
import typeOrm from '@config/tyorm';
import { MailService } from '@module/mail/mail.service';
import { MailModule } from '@module/mail/mail.module';

@Module({
  imports: [typeOrm, MailModule],
  providers: [CommonService, UsersService, MailService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}
