import { CommonService } from '@module/common/common.service';
import { CompanyController } from '@module/company/company.controller';
import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { UsersModule } from '@module/user/user.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';
import { MailModule } from '@module/mail/mail.module';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, CompanyService, UsersService],
  exports: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
