import { Logger } from 'winston';
import { JobService } from '@module/job/service/job.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { JobDto } from '@module/job/dto/job.dto';
import { JobFilterDto } from '@module/job/dto/job.filter.dto';
import { JobUDDto } from '@module/job/dto/jobUD.dto';

import { Role } from '@config/enum';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: JobDto) {
    try {
      return await this.jobService.create(body);
    } catch (error) {
      this.logger.error('url: job/create - job: ' + error?.job + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: JobFilterDto) {
    return await this.jobService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    return await this.jobService.findAll(query);
  }

  @Get('find-count-job')
  @HttpCode(HttpStatus.OK)
  async findCountJobByStatus(@Query() query: any) {
    return await this.jobService.findCountJobByStatus(query);
  }
  @Get('find-job')
  @HttpCode(HttpStatus.OK)
  async findJobByStatus(@Query() query: any) {
    return await this.jobService.findJobByStatus(query);
  }
  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.jobService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: JobUDDto, @Param('id') id: number) {
    try {
      return await this.jobService.update(body, id);
    } catch (error) {
      this.logger.error('url: job/update - job: ' + error?.job + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard)
  // @CheckAuthority(Management.USER, 'D')
  @Post('delete')
  @HttpCode(HttpStatus.OK)
  async delete(@Query() query: any) {
    try {
      return await this.jobService.delete(query);
    } catch (error) {
      this.logger.error('url: job/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
