import { Logger } from 'winston';
import { NoteHistoryInquiryService } from '@module/note_history_inquiry/service/note_history_inquiry.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { NoteHistoryInquiryDto } from '@module/note_history_inquiry/dto/note_history_inquiry.dto';
import { NoteHistoryInquiryFilterDto } from '@module/note_history_inquiry/dto/note_history_inquiry.filter.dto';
import { NoteHistoryInquiryUDDto } from '@module/note_history_inquiry/dto/note_history_inquiryUD.dto';

import { Role } from '@config/enum';
import { NoteHistoryInquiryQueryDto } from './dto/note_history_inquiry.query.dto';

@Controller('note_history_inquiry')
export class NoteHistoryInquiryController {
  constructor(
    private readonly noteHistoryInquiryService: NoteHistoryInquiryService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: NoteHistoryInquiryDto) {
    try {
      return await this.noteHistoryInquiryService.create(body);
    } catch (error) {
      this.logger.error('url: note_history_inquiry/create - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: NoteHistoryInquiryFilterDto) {
    return await this.noteHistoryInquiryService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: NoteHistoryInquiryQueryDto) {
    return await this.noteHistoryInquiryService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.noteHistoryInquiryService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: NoteHistoryInquiryUDDto, @Param('id') id: number) {
    try {
      return await this.noteHistoryInquiryService.update(body, id);
    } catch (error) {
      this.logger.error('url: note_history_inquiry/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
