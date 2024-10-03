import { Management, Role } from '@config/enum';
import { AtGuard } from '@module/auth/guards/at.guard';
import { AuthorityGuard } from '@module/auth/guards/authority.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { UserDto } from '@module/user/dto/user.dto';
import { UsersService } from '@module/user/service/user.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, UseGuards, Query } from '@nestjs/common';
import { Logger } from 'winston';
import { CheckAuthority } from './decorators/check-authority.decorator';
import { CheckRole } from './decorators/check-role.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { UserFilterDto } from './dto/user.filter.dto';
import { UserProfileDto } from './dto/user.profile.dto';
import { UserQueryDto, UserQueryCustomerDto } from './dto/user.query.dto';
import { User } from './entity/user.entity';
import { MailDto } from './dto/mail.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: UserDto) {
    try {
      return await this.usersService.create(body);
    } catch (error) {
      this.logger.error('url: user/create - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
  @Post('register-validate')
  @HttpCode(HttpStatus.OK)
  async registerValidate(@Body() body: any) {
    try {
      return await this.usersService.registerValidate(body);
    } catch (error) {
      this.logger.error('url: user/create - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  // @CheckAuthority(Management.USER, 'C')
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create-customer')
  @HttpCode(HttpStatus.OK)
  async createCustomer(@Body() body: Omit<UserDto, 'gender,status,authorities,role'>) {
    try {
      return await this.usersService.createCustomer(body);
    } catch (error) {
      this.logger.error('url: user/create-customer - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  // @CheckAuthority(Management.USER, 'U')
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:code')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: Omit<UserDto, 'username'>, @Param('code') code: string) {
    try {
      return await this.usersService.update(body, code);
    } catch (error) {
      this.logger.error('url: user/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @Post('sendmsg')
  @HttpCode(HttpStatus.OK)
  async sendMsgzalo(@Body() body: any) {
    try {
      return await this.usersService.sendMsgzalo(body);
    } catch (error) {
      this.logger.error('url: user/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
  @Post('get-token-zalo')
  @HttpCode(HttpStatus.OK)
  async getTokenzalo(@Body() code: any) {
    try {
      return await this.usersService.exchangeCodeForAccessToken(code);
    } catch (error) {
      this.logger.error('url: user/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @Post('sendMail')
  @HttpCode(HttpStatus.OK)
  async sendMsgmail(@Body() data: MailDto) {
    try {
      return await this.usersService.sendMsgmail(data);
    } catch (error) {
      this.logger.error('url: user/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @Post('create-audience')
  @HttpCode(HttpStatus.OK)
  async createAudience(@Query() audienceData: any) {
    try {
      return await this.usersService.createAudience(audienceData);
    } catch (error) {
      this.logger.error('url: user/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: UserFilterDto) {
    return await this.usersService.find(body);
  }
  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    return await this.usersService.findAll(query);
  }

  @Get('find-all-customer')
  @HttpCode(HttpStatus.OK)
  async findAllCustomer(@Query() query: UserQueryCustomerDto) {
    return await this.usersService.findAllCustomer(query);
  }

  @Get('find-all-staff')
  @HttpCode(HttpStatus.OK)
  async findAllStaff(@Query() query: UserQueryDto) {
    return await this.usersService.findAllStaff(query);
  }

  // @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.USER, 'R')
  @Get('get-detail/:code')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('code') code: string) {
    return await this.usersService.getDetail(code);
  }

  @Post('update-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async updateProfile(@Body() body: UserProfileDto, @GetUser() user: User) {
    try {
      return await this.usersService.updateProfile(body, user);
    } catch (error) {
      this.logger.error('url: user/update-profile - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async getProfile(@GetUser() user: User) {
    return await this.usersService.getProfile(user);
  }
  @Get('profile-user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async getProfileUser(@GetUser() user: User) {
    return await this.usersService.getProfileUser(user);
  }

  @UseGuards(AtGuard, RoleGuard)
  // @CheckAuthority(Management.USER, 'D')
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('delete')
  @HttpCode(HttpStatus.OK)
  async delete(@Query() query: any) {
    try {
      return await this.usersService.delete(query);
    } catch (error) {
      this.logger.error('url: USER/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
