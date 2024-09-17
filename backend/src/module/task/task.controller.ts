import { Logger } from 'winston';
import { TaskService } from '@module/task/service/task.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { TaskDto } from '@module/task/dto/task.dto';
import { TaskFilterDto } from '@module/task/dto/task.filter.dto';
import { TaskUDDto } from '@module/task/dto/taskUD.dto';

import { Role } from '@config/enum';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: TaskDto) {
    try {
      return await this.taskService.create(body);
    } catch (error) {
      this.logger.error('url: task/create - task: ' + error?.task + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: TaskFilterDto) {
    return await this.taskService.find(body);
  }

  @Get('find-count-task')
  @HttpCode(HttpStatus.OK)
  async findCountTaskByStatus(@Query() query: any) {
    return await this.taskService.findCountTaskByStatus(query);
  }
  @Get('find-task')
  @HttpCode(HttpStatus.OK)
  async findTaskByStatus(@Query() query: any) {
    return await this.taskService.findTaskByStatus(query);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    return await this.taskService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.taskService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: TaskUDDto, @Param('id') id: number) {
    try {
      return await this.taskService.update(body, id);
    } catch (error) {
      this.logger.error('url: task/update - task: ' + error?.task + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    try {
      return await this.taskService.delete(id);
    } catch (error) {
      this.logger.error('url: task/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
