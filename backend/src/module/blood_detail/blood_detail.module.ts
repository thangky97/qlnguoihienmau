import { CommonService } from '@module/common/common.service';
import { BloodDetailController } from '@module/blood_detail/blood_detail.controller';
import { Module } from '@nestjs/common';
import { BloodDetailService } from './service/blood_detail.service';
import { UsersService } from '@module/user/service/user.service';
import { BloodService } from '@module/blood/service/blood.service';
import typeOrm from '@config/tyorm';
import { MailModule } from '@module/mail/mail.module';

@Module({
  imports: [typeOrm, MailModule],
  providers: [CommonService, BloodDetailService, BloodService, UsersService],
  exports: [BloodDetailService],
  controllers: [BloodDetailController],
})
export class BloodDetailModule {}
