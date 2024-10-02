import { Logger } from 'winston';
import { EnventService } from '@module/envent/service/envent.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { EnventDto } from '@module/envent/dto/envent.dto';
import { EnventFilterDto } from '@module/envent/dto/envent.filter.dto';
import { EnventUDDto } from '@module/envent/dto/enventUD.dto';

import { Role } from '@config/enum';

@Controller('envent')
export class EnventController {
  constructor(
    private readonly enventService: EnventService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  // @UseGuards(AtGuard, RoleGuard)
  // @CheckRole([Role.STAFF, Role.ADMIN])
  // @Post('create')
  // @HttpCode(HttpStatus.OK)
  // async create(@Body() body: EnventDto) {
  //   try {
  //     return await this.enventService.create(body);
  //   } catch (error) {
  //     this.logger.error('url: envent/create - envent: ' + error?.envent + ' - response: ' + error?.response);
  //     throw error.response;
  //   }
  // }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: EnventDto) {
    try {
      // user_id_array được lấy từ body, giờ đã được xác thực qua DTO
      const user_id_array = body.user_id;

      // Chuyển tiếp body và mảng user_id_array đến service
      return await this.enventService.create(body, user_id_array);
    } catch (error) {
      this.logger.error('url: envent/create - envent: ' + error?.envent + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: EnventFilterDto) {
    return await this.enventService.find(body);
  }

  @Post('find-user')
  @HttpCode(HttpStatus.OK)
  async findUser(@Body() body: EnventFilterDto) {
    return await this.enventService.findUser(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    return await this.enventService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.enventService.getDetail(id);
  }

  @Get('get-detail-user/:id')
  @HttpCode(HttpStatus.OK)
  async getDetailUser(@Param('id') id: number) {
    return await this.enventService.getDetailUser(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: EnventUDDto, @Param('id') id: number) {
    try {
      return await this.enventService.update(body, id);
    } catch (error) {
      this.logger.error('url: envent/update - envent: ' + error?.envent + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard)
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    try {
      return await this.enventService.delete(id);
    } catch (error) {
      this.logger.error('url: envent/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
