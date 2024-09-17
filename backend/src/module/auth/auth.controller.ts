import { Role } from '@config/enum';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { GetUser } from '@module/user/decorators/get-user.decorator';
import { User } from '@module/user/entity/user.entity';
import { UsersService } from '@module/user/service/user.service';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignInGoogleDto } from './dto/sign-in-google.dto';
import { SignUpCustomerDto } from './dto/sign-up-customer.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AtGuard } from './guards/at.guard';
import { ResetPasswordGuard } from './guards/resetPassword.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { RoleGuard } from './guards/role.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async signIn(@GetUser() user: User) {
    const data = await this.authService.signIn(user);
    delete data.password;
    return data;
  }

  @Post('sign-up-customer')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(LocalAuthGuard)
  async signUpCustomer(@Body() user: SignUpCustomerDto) {
    const data = await this.authService.signUpCustomer(user);
    return data;
  }

  @Post('sign-in-google')
  @HttpCode(HttpStatus.OK)
  async signInGoogle(@Body() userGoogle: SignInGoogleDto) {
    try {
      const data = await this.authService.signInGoogle(userGoogle);
      delete data.password;
      return data;
    } catch (error) {
      this.logger.error('url: sign-in-google - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.ACCOUNTANT, Role.ADMIN, Role.OPERATOR, Role.STAFF, Role.HDV, Role.CUSTOMER])
  async changePassword(@Body() body: ChangePasswordDto, @GetUser() user: User) {
    try {
      await this.authService.changePassword(body, user);
    } catch (error) {
      this.logger.error('url: change-password - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      return await this.authService.forgotPassword(body);
    } catch (error) {
      this.logger.error('url: forgot-password - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @Post('reset-password')
  @UseGuards(ResetPasswordGuard)
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto, @GetUser() user: User) {
    try {
      return await this.authService.resetPassword(body, user);
    } catch (error) {
      this.logger.error('url: change-password - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
