import { Logger } from 'winston';
import { CompanyService } from '@module/company/service/company.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { CompanyDto } from '@module/company/dto/company.dto';
import { CompanyFilterDto } from '@module/company/dto/company.filter.dto';
import { CompanyUDDto } from '@module/company/dto/companyUD.dto';
import { AtGuard } from '@module/auth/guards/at.guard';
import { AuthorityGuard } from '@module/auth/guards/authority.guard';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.MESSAGE, 'C')
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: CompanyDto) {
    try {
      return await this.companyService.create(body);
    } catch (error) {
      this.logger.error('url: message/create - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  // @CheckAuthority(Management.MESSAGE, 'C')
  @Post('user-create')
  @HttpCode(HttpStatus.OK)
  async userCreate(@Body() body: CompanyDto) {
    try {
      return await this.companyService.create(body);
    } catch (error) {
      this.logger.error('url: message/create - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.MESSAGE, 'R')
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: CompanyFilterDto) {
    return await this.companyService.find(body);
  }

  @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.MESSAGE, 'R')
  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.companyService.findAll();
  }

  @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.MESSAGE, 'R')
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.companyService.getDetail(id);
  }

  @UseGuards(AtGuard)
  @Get('get-detail-customer/:id')
  @HttpCode(HttpStatus.OK)
  async getDetailCustomer(@Param('id') id: number) {
    return await this.companyService.getDetailCustomer(id);
  }

  @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.MESSAGE, 'U')
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: CompanyUDDto, @Param('id') id: number) {
    try {
      return await this.companyService.update(body, id);
    } catch (error) {
      this.logger.error('url: message/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.USER, 'D')
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    try {
      return await this.companyService.delete(id);
    } catch (error) {
      this.logger.error('url: USER/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @Get('find-company-customer')
  @HttpCode(HttpStatus.OK)
  async findCompanyCustomer() {
    return await this.companyService.findCompanyCustomer();
  }
}
