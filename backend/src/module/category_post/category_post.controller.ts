import { Logger } from 'winston';
import { CategoryPostService } from '@module/category_post/service/category_post.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { CategoryPostDto } from '@module/category_post/dto/category_post.dto';
import { CategoryPostFilterDto } from '@module/category_post/dto/category_post.filter.dto';
import { CategoryPostUDDto } from '@module/category_post/dto/category_postUD.dto';

import { Role } from '@config/enum';
import { CategoryPostQueryDto } from './dto/category_post.query.dto';

@Controller('category_post')
export class CategoryPostController {
  constructor(
    private readonly categoryPostService: CategoryPostService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: CategoryPostDto) {
    try {
      return await this.categoryPostService.create(body);
    } catch (error) {
      this.logger.error('url: category_post/create - category_post: ' + error?.category_post + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: CategoryPostFilterDto) {
    return await this.categoryPostService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: CategoryPostQueryDto) {
    return await this.categoryPostService.findAll(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.categoryPostService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: CategoryPostUDDto, @Param('id') id: number) {
    try {
      return await this.categoryPostService.update(body, id);
    } catch (error) {
      this.logger.error('url: category_post/update - category_post: ' + error?.category_post + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.ADMIN, Role.STAFF])
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete_department(@Param('id') id: number) {
    try {
      return await this.categoryPostService.delete_department(id);
    } catch (error) {
      this.logger.error('url: category_post/delete - category_post: ' + error?.category_post + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
