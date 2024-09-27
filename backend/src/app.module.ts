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
import { Company } from '@module/company/entity/company.entity';
import { CompanyModule } from '@module/company/company.module';

import { Branch } from '@module/branch/entity/branch.entity';
import { BranchModule } from '@module/branch/branch.module';

import { Jobfield } from '@module/jobfield/entity/jobfield.entity';
import { JobfieldModule } from '@module/jobfield/jobfield.module';

import { Customer } from '@module/customer/entity/customer.entity';
import { CustomerModule } from '@module/customer/customer.module';

import { Department } from '@module/department/entity/department.entity';
import { DepartmentModule } from '@module/department/department.module';

import { Workingprocesstemplate } from '@module/workingprocesstemplate/entity/workingprocesstemplate.entity';
import { WorkingprocesstemplateModule } from '@module/workingprocesstemplate/workingprocesstemplate.module';

import { Inquiry } from '@module/inquiry/entity/inquiry.entity';
import { InquiryModule } from '@module/inquiry/inquiry.module';

import { Contract } from '@module/contract/entity/contract.entity';
import { ContractModule } from '@module/contract/contract.module';

import { Job } from '@module/job/entity/job.entity';
import { JobModule } from '@module/job/job.module';

import { Task } from '@module/task/entity/task.entity';
import { TaskModule } from '@module/task/task.module';

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
          entities: [User, Authority, Company, Branch, Jobfield, Customer, Department, Workingprocesstemplate, Inquiry, Contract, Job, Task, NoteHistoryInquiry, NoteHistoryContract, CategoryPost, Envent, RegisterDonateBlood, Hospital],
          // logging:true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    CommonModule,
    CompanyModule,
    BranchModule,
    JobfieldModule,
    CustomerModule,
    DepartmentModule,
    WorkingprocesstemplateModule,
    InquiryModule,
    ContractModule,
    JobModule,
    TaskModule,
    NoteHistoryInquiryModule,
    NoteHistoryContractModule,
    CategoryPostModule,
    EnventModule,
    RegisterDonateBloodModule,
    HospitalModule,
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
