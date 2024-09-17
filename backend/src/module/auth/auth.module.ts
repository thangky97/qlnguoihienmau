import { MailModule } from '@module/mail/mail.module';
import { UsersModule } from '@module/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy } from './strategies/at.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ResetPasswordStrategy } from './strategies/resetPassword.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@module/user/entity/user.entity';
import { CompanyModule } from '@module/company/company.module';
import { Company } from '@module/company/entity/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    UsersModule,
    PassportModule,
    MailModule,
    CompanyModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, LocalStrategy, AtStrategy, ResetPasswordStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
