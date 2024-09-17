import { Logger } from 'winston';
import { InquiryService } from '@module/inquiry/service/inquiry.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { InquiryDto } from '@module/inquiry/dto/inquiry.dto';
import { InquiryFilterDto } from '@module/inquiry/dto/inquiry.filter.dto';
import { InquiryUDDto } from '@module/inquiry/dto/inquiryUD.dto';

import { Role } from '@config/enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('inquiry')
export class InquiryController {
  constructor(
    private readonly inquiryService: InquiryService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: InquiryDto) {
    try {
      return await this.inquiryService.create(body);
    } catch (error) {
      this.logger.error('url: inquiry/create - inquiry: ' + error?.inquiry + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: InquiryFilterDto) {
    return await this.inquiryService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    return await this.inquiryService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.inquiryService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: InquiryUDDto, @Param('id') id: number) {
    try {
      return await this.inquiryService.update(body, id);
    } catch (error) {
      this.logger.error('url: inquiry/update - inquiry: ' + error?.inquiry + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard)
  // @CheckAuthority(Management.USER, 'D')
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    try {
      return await this.inquiryService.delete(id);
    } catch (error) {
      this.logger.error('url: inquiry/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard)
  // @CheckAuthority(Management.SUPPLIERMATERIAL, 'I')
  @Post('import')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.inquiryService.import(file);
    } catch (error) {
      this.logger.error('url: inquiry/import - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
