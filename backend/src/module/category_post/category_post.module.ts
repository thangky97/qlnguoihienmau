import { CommonService } from '@module/common/common.service';

import { CategoryPostController } from '@module/category_post/category_post.controller';
import { Module } from '@nestjs/common';
import { CategoryPostService } from '@module/category_post/service/category_post.service';

import { UsersModule } from '@module/user/user.module';
import { MailModule } from '@module/mail/mail.module';
import { UsersService } from '@module/user/service/user.service';
import typeOrm from '@config/tyorm';

@Module({
  imports: [typeOrm, UsersModule, MailModule],
  providers: [CommonService, CategoryPostService, UsersService],
  exports: [CategoryPostService],
  controllers: [CategoryPostController],
})
export class CategoryPostModule {}
