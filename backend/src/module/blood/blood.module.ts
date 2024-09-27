import { CommonService } from '@module/common/common.service';
import { BloodController } from '@module/blood/blood.controller';
import { Module } from '@nestjs/common';
import { BloodService } from './service/blood.service';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';
import { MailModule } from '@module/mail/mail.module';

@Module({
  imports: [typeOrm, MailModule],
  providers: [CommonService, BloodService, UsersService],
  exports: [BloodService],
  controllers: [BloodController],
})
export class BloodModule {}
