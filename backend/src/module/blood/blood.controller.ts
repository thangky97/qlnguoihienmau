import { Management, Role } from '@config/enum';
import { AtGuard } from '@module/auth/guards/at.guard';
import { AuthorityGuard } from '@module/auth/guards/authority.guard';
import { BloodDto } from '@module/blood/dto/blood.dto';
import { BloodFilterDto } from '@module/blood/dto/blood.filter.dto';
import { BloodService } from '@module/blood/service/blood.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';
import { CheckAuthority } from './decorators/check-authority.decorator';

@Controller('blood')
export class BloodController {
  constructor(
    private readonly BloodService: BloodService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.MATERIALTRANSACTION, 'C')
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: BloodDto) {
    try {
      return await this.BloodService.create(body);
    } catch (error) {
      this.logger.error('url: blood/create - blood: ' + error?.blood + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  // @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.MATERIALTRANSACTION, 'R')
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: BloodFilterDto) {
    return await this.BloodService.find(body);
  }

  // @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.MATERIALTRANSACTION, 'R')
  @Get('get-detail/:code')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('code') code: string) {
    return await this.BloodService.getDetail(code);
  }

  @UseGuards(AtGuard, AuthorityGuard)
  // @CheckAuthority(Management.MATERIALTRANSACTION, 'U')
  @Post('update/:code')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: BloodDto, @Param('code') code: string) {
    try {
      return await this.BloodService.update(body, code);
    } catch (error) {
      this.logger.error('url: blood/update - blood: ' + error?.blood + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
