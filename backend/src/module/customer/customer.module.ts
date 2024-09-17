import { CommonService } from '@module/common/common.service';
import { CustomerController } from '@module/customer/customer.controller';
import { Module } from '@nestjs/common';
import { CustomerService } from './service/customer.service';
import typeOrm from '@config/tyorm';
import { UsersService } from '@module/user/service/user.service';
import { MailModule } from '@module/mail/mail.module';

@Module({
  imports: [typeOrm, MailModule],
  providers: [CommonService, CustomerService, UsersService],
  exports: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
