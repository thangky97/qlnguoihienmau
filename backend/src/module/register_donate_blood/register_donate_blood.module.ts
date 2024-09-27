import { CommonService } from '@module/common/common.service';

import { RegisterDonateBloodController } from '@module/register_donate_blood/register_donate_blood.controller';
import { Module } from '@nestjs/common';
import { RegisterDonateBloodService } from '@module/register_donate_blood/service/register_donate_blood.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, RegisterDonateBloodService, UsersService],
  exports: [RegisterDonateBloodService],
  controllers: [RegisterDonateBloodController],
})
export class RegisterDonateBloodModule {}
