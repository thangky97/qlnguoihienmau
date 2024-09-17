import { Management, Role } from '@config/enum';
import { AtGuard } from '@module/auth/guards/at.guard';
import { AuthorityGuard } from '@module/auth/guards/authority.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { CustomerDto } from '@module/customer/dto/customer.dto';
import { CustomerFilterDto } from '@module/customer/dto/customer.filter.dto';
import { CustomerQueryDto } from '@module/customer/dto/customer.query.dto';
import { CustomerService } from '@module/customer/service/customer.service';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: CustomerDto) {
    try {
      return await this.customerService.create(body);
    } catch (error) {
      this.logger.error('url: customer/create - customer: ' + error?.customer + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create-customer')
  @HttpCode(HttpStatus.OK)
  async createCustomer(@Body() body: Omit<CustomerDto, 'gender,status,authorities,role'>) {
    try {
      return await this.customerService.createCustomer(body);
    } catch (error) {
      this.logger.error('url: customer/create-customer - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: CustomerQueryDto) {
    return await this.customerService.findAll(query);
  }

  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: CustomerFilterDto) {
    return await this.customerService.find(body);
  }

  @Get('get-detail/:code')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('code') code: string) {
    return await this.customerService.getDetail(code);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:code')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: CustomerDto, @Param('code') code: string) {
    try {
      return await this.customerService.update(body, code);
    } catch (error) {
      this.logger.error('url: customer/update - customer: ' + error?.customer + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('delete')
  @HttpCode(HttpStatus.OK)
  async delete(@Query() query: any) {
    try {
      return await this.customerService.delete(query);
    } catch (error) {
      this.logger.error('url: customer/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
