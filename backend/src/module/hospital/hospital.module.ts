import { CommonService } from '@module/common/common.service';

import { HospitalController } from '@module/hospital/hospital.controller';
import { Module } from '@nestjs/common';
import { HospitalService } from '@module/hospital/service/hospital.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, HospitalService, UsersService],
  exports: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}
