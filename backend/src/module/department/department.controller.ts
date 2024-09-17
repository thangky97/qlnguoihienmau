import { Logger } from 'winston';
import { DepartmentService } from '@module/department/service/department.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { DepartmentDto } from '@module/department/dto/department.dto';
import { DepartmentFilterDto } from '@module/department/dto/department.filter.dto';
import { DepartmentUDDto } from '@module/department/dto/departmentUD.dto';

import { Role } from '@config/enum';
import { DepartmentQueryDto } from './dto/department.query.dto';

@Controller('department')
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: DepartmentDto) {
    try {
      return await this.departmentService.create(body);
    } catch (error) {
      this.logger.error('url: department/create - department: ' + error?.department + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: DepartmentFilterDto) {
    return await this.departmentService.find(body);
  }

  @Get('statistical-task')
  @HttpCode(HttpStatus.OK)
  async StatisticalTask(@Query() query: any) {
    return await this.departmentService.StatisticalTask(query);
  }

  @Get('statistical-job')
  @HttpCode(HttpStatus.OK)
  async StatisticalJob(@Query() query: any) {
    return await this.departmentService.StatisticalJob(query);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: DepartmentQueryDto) {
    return await this.departmentService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.departmentService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('report')
  @HttpCode(HttpStatus.OK)
  async report(@Query() query: any) {
    return await this.departmentService.report(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: DepartmentUDDto, @Param('id') id: number) {
    try {
      return await this.departmentService.update(body, id);
    } catch (error) {
      this.logger.error('url: department/update - department: ' + error?.department + ' - response: ' + error?.response);
      throw error.response;
    }
  }


  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.ADMIN,Role.COMPANYADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete_department(@Param('id') id: number) {
    try {
      return await this.departmentService.delete_department(id);
    } catch (error) {
      this.logger.error('url: department/delete - department: ' + error?.department + ' - response: ' + error?.response);
      throw error.response;
    }
  }

}
