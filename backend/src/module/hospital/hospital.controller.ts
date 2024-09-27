import { Logger } from 'winston';
import { HospitalService } from '@module/hospital/service/hospital.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { HospitalDto } from '@module/hospital/dto/hospital.dto';
import { HospitalFilterDto } from '@module/hospital/dto/hospital.filter.dto';
import { HospitalUDDto } from '@module/hospital/dto/hospitalUD.dto';

import { Role } from '@config/enum';
import { HospitalQueryDto } from './dto/hospital.query.dto';

@Controller('hospital')
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: HospitalDto) {
    try {
      return await this.hospitalService.create(body);
    } catch (error) {
      this.logger.error('url: hospital/create - hospital: ' + error?.hospital + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: HospitalFilterDto) {
    return await this.hospitalService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: HospitalQueryDto) {
    return await this.hospitalService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.hospitalService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: HospitalUDDto, @Param('id') id: number) {
    try {
      return await this.hospitalService.update(body, id);
    } catch (error) {
      this.logger.error('url: hospital/update - hospital: ' + error?.hospital + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.ADMIN, Role.STAFF])
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete_department(@Param('id') id: number) {
    try {
      return await this.hospitalService.delete(id);
    } catch (error) {
      this.logger.error('url: hospital/delete - hospital: ' + error?.hospital + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
