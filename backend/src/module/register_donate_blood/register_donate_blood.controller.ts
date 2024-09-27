import { Logger } from 'winston';
import { RegisterDonateBloodService } from '@module/register_donate_blood/service/register_donate_blood.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { RegisterDonateBloodDto } from '@module/register_donate_blood/dto/register_donate_blood.dto';
import { RegisterDonateBloodFilterDto } from '@module/register_donate_blood/dto/register_donate_blood.filter.dto';
import { RegisterDonateBloodUDDto } from '@module/register_donate_blood/dto/register_donate_bloodUD.dto';

import { Role } from '@config/enum';

@Controller('register_donate_blood')
export class RegisterDonateBloodController {
  constructor(
    private readonly registerDonateBloodService: RegisterDonateBloodService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: RegisterDonateBloodDto) {
    try {
      return await this.registerDonateBloodService.create(body);
    } catch (error) {
      this.logger.error('url: register_donate_blood/create - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: RegisterDonateBloodFilterDto) {
    return await this.registerDonateBloodService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: RegisterDonateBloodDto) {
    return await this.registerDonateBloodService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.registerDonateBloodService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: RegisterDonateBloodUDDto, @Param('id') id: number) {
    try {
      return await this.registerDonateBloodService.update(body, id);
    } catch (error) {
      this.logger.error('url: register_donate_blood/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard)
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    try {
      return await this.registerDonateBloodService.delete(id);
    } catch (error) {
      this.logger.error('url: register_donate_blood/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
