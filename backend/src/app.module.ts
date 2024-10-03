import { AuthModule } from '@module/auth/auth.module';
import { Authority } from '@module/user/entity/authority.entity';
import { User } from '@module/user/entity/user.entity';
import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CommonModule } from '@module/common/common.module';
import { UsersModule } from '@module/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';

import { Customer } from '@module/customer/entity/customer.entity';
import { CustomerModule } from '@module/customer/customer.module';

import { NoteHistoryInquiry } from '@module/note_history_inquiry/entity/note_history_inquiry.entity';
import { NoteHistoryInquiryModule } from '@module/note_history_inquiry/note_history_inquiry.module';

import { NoteHistoryContract } from '@module/note_history_contract/entity/note_history_contract.entity';
import { NoteHistoryContractModule } from '@module/note_history_contract/note_history_contract.module';

import { CategoryPost } from '@module/category_post/entity/category_post.entity';
import { CategoryPostModule } from '@module/category_post/category_post.module';

import { Envent } from '@module/envent/entity/envent.entity';
import { EnventModule } from '@module/envent/envent.module';

import { RegisterDonateBlood } from '@module/register_donate_blood/entity/register_donate_blood.entity';
import { RegisterDonateBloodModule } from '@module/register_donate_blood/register_donate_blood.module';

import { Hospital } from '@module/hospital/entity/hospital.entity';
import { HospitalModule } from '@module/hospital/hospital.module';

import { Blood } from '@module/blood/entity/blood.entity';
import { BloodModule } from '@module/blood/blood.module';

import { BloodDetailModule } from '@module/blood_detail/blood_detail.module';
import { BloodDetail } from '@module/blood_detail/entity/blood_detail.entity';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.File({
          dirname: './log',
          filename: 'error.log',
          level: 'error',
        }),
      ],
    }),
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, 'uploads'),
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<number>('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [User, Authority, Customer, NoteHistoryInquiry, NoteHistoryContract, CategoryPost, Envent, RegisterDonateBlood, Hospital, Blood, BloodDetail],
          // logging:true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    CommonModule,
    CustomerModule,
    NoteHistoryInquiryModule,
    NoteHistoryContractModule,
    CategoryPostModule,
    EnventModule,
    RegisterDonateBloodModule,
    HospitalModule,
    BloodModule,
    BloodDetailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    Logger,
  ],
})
export class AppModule {
  constructor() {}
  configure() {}
}
