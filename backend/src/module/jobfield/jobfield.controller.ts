import { Logger } from 'winston';
import { JobfieldService } from '@module/jobfield/service/jobfield.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { JobfieldDto } from '@module/jobfield/dto/jobfield.dto';
import { JobfieldFilterDto } from '@module/jobfield/dto/jobfield.filter.dto';
import { JobfieldUDDto } from '@module/jobfield/dto/jobfieldUD.dto';

import { Role } from '@config/enum';
import { JobfieldQueryDto } from './dto/jobfield.query.dto';

@Controller('jobfield')
export class JobfieldController {
  constructor(
    private readonly jobfieldService: JobfieldService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: JobfieldDto) {
    try {
      return await this.jobfieldService.create(body);
    } catch (error) {
      this.logger.error('url: jobfield/create - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: JobfieldFilterDto) {
    return await this.jobfieldService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: JobfieldQueryDto) {
    return await this.jobfieldService.findAll(query);
  }

  @Get('statistical')
  @HttpCode(HttpStatus.OK)
  async Statistical(@Query() query: any) {
    return await this.jobfieldService.Statistical(query);
  }

  @Get('statistical-job')
  @HttpCode(HttpStatus.OK)
  async StatisticalJob(@Query() query: any) {
    return await this.jobfieldService.StatisticalJob(query);
  }
  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.jobfieldService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: JobfieldUDDto, @Param('id') id: number) {
    try {
      return await this.jobfieldService.update(body, id);
    } catch (error) {
      this.logger.error('url: jobfield/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard)
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    try {
      return await this.jobfieldService.delete(id);
    } catch (error) {
      this.logger.error('url: jobfield/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
