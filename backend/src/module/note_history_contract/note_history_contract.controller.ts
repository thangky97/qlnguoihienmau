import { Logger } from 'winston';
import { NoteHistoryContractService } from '@module/note_history_contract/service/note_history_contract.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { NoteHistoryContractDto } from '@module/note_history_contract/dto/note_history_contract.dto';
import { NoteHistoryContractFilterDto } from '@module/note_history_contract/dto/note_history_contract.filter.dto';
import { NoteHistoryContractUDDto } from '@module/note_history_contract/dto/note_history_contractUD.dto';

import { Role } from '@config/enum';
import { NoteHistoryContractQueryDto } from './dto/note_history_contract.query.dto';

@Controller('note_history_contract')
export class NoteHistoryContractController {
  constructor(
    private readonly noteHistoryContractService: NoteHistoryContractService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: NoteHistoryContractDto) {
    try {
      return await this.noteHistoryContractService.create(body);
    } catch (error) {
      this.logger.error('url: note_history_contract/create - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: NoteHistoryContractFilterDto) {
    return await this.noteHistoryContractService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: NoteHistoryContractQueryDto) {
    return await this.noteHistoryContractService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.noteHistoryContractService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: NoteHistoryContractUDDto, @Param('id') id: number) {
    try {
      return await this.noteHistoryContractService.update(body, id);
    } catch (error) {
      this.logger.error('url: note_history_contract/update - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
