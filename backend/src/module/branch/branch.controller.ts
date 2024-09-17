import { Logger } from 'winston';
import { BranchService } from '@module/branch/service/branch.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { BranchDto } from '@module/branch/dto/branch.dto';
import { BranchFilterDto } from '@module/branch/dto/branch.filter.dto';
import { BranchUDDto } from '@module/branch/dto/branchUD.dto';

import { Role } from '@config/enum';
import { BranchQueryDto } from './dto/branch.query.dto';

@Controller('branch')
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.ACCOUNTANT, Role.ADMIN, Role.OPERATOR, Role.STAFF, Role.HDV, Role.AGENT, Role.COMPANYADMIN])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: BranchDto) {
    try {
      return await this.branchService.create(body);
    } catch (error) {
      this.logger.error('url: message/create - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.ACCOUNTANT, Role.ADMIN, Role.OPERATOR, Role.STAFF, Role.HDV, Role.AGENT, Role.COMPANYADMIN])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: BranchFilterDto) {
    return await this.branchService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: BranchQueryDto) {
    return await this.branchService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.ACCOUNTANT, Role.ADMIN, Role.OPERATOR, Role.STAFF, Role.HDV, Role.AGENT, Role.COMPANYADMIN])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.branchService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.ACCOUNTANT, Role.ADMIN, Role.OPERATOR, Role.STAFF, Role.AGENT, Role.HDV, Role.COMPANYADMIN])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: BranchUDDto, @Param('id') id: number) {
    try {
      return await this.branchService.update(body, id);
    } catch (error) {
      this.logger.error('url: message/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
