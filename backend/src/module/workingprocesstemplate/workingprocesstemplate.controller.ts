import { Logger } from 'winston';
import { WorkingprocesstemplateService } from '@module/workingprocesstemplate/service/workingprocesstemplate.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { WorkingprocesstemplateDto } from '@module/workingprocesstemplate/dto/workingprocesstemplate.dto';
import { WorkingprocesstemplateFilterDto } from '@module/workingprocesstemplate/dto/workingprocesstemplate.filter.dto';
import { WorkingprocesstemplateUDDto } from '@module/workingprocesstemplate/dto/workingprocesstemplateUD.dto';

import { Role } from '@config/enum';
import { WorkingprocesstemplateQueryDto } from './dto/workingprocesstemplate.query.dto';

@Controller('workingprocesstemplate')
export class WorkingprocesstemplateController {
  constructor(
    private readonly workingprocesstemplateService: WorkingprocesstemplateService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: WorkingprocesstemplateDto) {
    try {
      return await this.workingprocesstemplateService.create(body);
    } catch (error) {
      this.logger.error('url: workingprocesstemplate/create - workingprocesstemplate: ' + error?.workingprocesstemplate + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: WorkingprocesstemplateFilterDto) {
    return await this.workingprocesstemplateService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    return await this.workingprocesstemplateService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.workingprocesstemplateService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: WorkingprocesstemplateUDDto, @Param('id') id: number) {
    try {
      return await this.workingprocesstemplateService.update(body, id);
    } catch (error) {
      this.logger.error('url: workingprocesstemplate/update - workingprocesstemplate: ' + error?.workingprocesstemplate + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard)
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    try {
      return await this.workingprocesstemplateService.delete(id);
    } catch (error) {
      this.logger.error('url: workingprocesstemplate/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
