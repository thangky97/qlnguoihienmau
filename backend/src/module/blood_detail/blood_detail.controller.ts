import { Management, Role } from '@config/enum';
import { AtGuard } from '@module/auth/guards/at.guard';
import { AuthorityGuard } from '@module/auth/guards/authority.guard';
import { BloodDetailDto } from '@module/blood_detail/dto/blood_detail.dto';
import { BloodDetailFilterDto } from '@module/blood_detail/dto/blood_detail.filter.dto';
import { BloodDetailService } from '@module/blood_detail/service/blood_detail.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';

@Controller('blood/detail')
export class BloodDetailController {
  constructor(
    private readonly bloodDetailService: BloodDetailService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, AuthorityGuard)
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: BloodDetailDto) {
    try {
      return await this.bloodDetailService.create(body);
    } catch (error) {
      this.logger.error('url: blood/detail/create - blood: ' + error?.blood + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  // @UseGuards(AtGuard, AuthorityGuard)
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: BloodDetailFilterDto) {
    return await this.bloodDetailService.find(body);
  }

  // @UseGuards(AtGuard, AuthorityGuard)
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: string) {
    return await this.bloodDetailService.getDetail(id);
  }

  @UseGuards(AtGuard, AuthorityGuard)
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: BloodDetailDto, @Param('id') id: number) {
    try {
      return await this.bloodDetailService.update(body, id);
    } catch (error) {
      this.logger.error('url: blood/detail/update - blood: ' + error?.blood + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, AuthorityGuard)
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    try {
      return await this.bloodDetailService.delete(id);
    } catch (error) {
      this.logger.error('url: blood/detail/delete - blood: ' + error?.blood + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
