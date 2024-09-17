import { Logger } from 'winston';
import { ContractService } from '@module/contract/service/contract.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CheckRole } from '@module/user/decorators/check-role.decorator';
import { AtGuard } from '@module/auth/guards/at.guard';
import { RoleGuard } from '@module/auth/guards/role.guard';
import { ContractDto } from '@module/contract/dto/contract.dto';
import { ContractFilterDto } from '@module/contract/dto/contract.filter.dto';
import { ContractUDDto } from '@module/contract/dto/contractUD.dto';

import { ProcessingStatus, Role, StatusContract } from '@config/enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('contract')
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: ContractDto) {
    try {
      return await this.contractService.create(body);
    } catch (error) {
      this.logger.error('url: contract/create - contract: ' + error?.contract + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('find')
  @HttpCode(HttpStatus.OK)
  async find(@Body() body: ContractFilterDto) {
    return await this.contractService.find(body);
  }

  @Get('find-all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    return await this.contractService.findAll(query);
  }

  @Get('find-all-task')
  @HttpCode(HttpStatus.OK)
  async findAllTask(@Query() query: any) {
    return await this.contractService.findAllTask(query);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-job-contract/:id')
  @HttpCode(HttpStatus.OK)
  async getJobcontract(@Param('id') id: number) {
    return await this.contractService.getJobcontract(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Get('get-detail/:id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') id: number) {
    return await this.contractService.getDetail(id);
  }

  @UseGuards(AtGuard, RoleGuard)
  @CheckRole([Role.STAFF, Role.ADMIN, Role.DEPUTY, Role.VICPRESIDENT, Role.PRESIDENT, Role.MANAGER])
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: ContractUDDto, @Param('id') id: number) {
    try {
      return await this.contractService.update(body, id);
    } catch (error) {
      this.logger.error('url: contract/update - contract: ' + error?.contract + ' - response: ' + error?.response);
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
      return await this.contractService.import(file);
    } catch (error) {
      this.logger.error('url: contract/import - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard)
  // @CheckAuthority(Management.USER, 'D')
  @Post('delete')
  @HttpCode(HttpStatus.OK)
  async delete(@Query() query: any) {
    try {
      return await this.contractService.delete(query);
    } catch (error) {
      this.logger.error('url: contract/delete - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }

  @UseGuards(AtGuard)
  @Post('update-contract-tasks-status')
  @HttpCode(HttpStatus.OK)
  async updatetaskscontractstatus(@Body() body: { contractId: number; status: ProcessingStatus }) {
    try {
      const { contractId, status } = body;
      return await this.contractService.updatetaskscontractstatus(contractId, status);
    } catch (error) {
      this.logger.error('url: contract/update-contract-tasks-status - message: ' + error?.message + ' - response: ' + error?.response);
      throw error.response;
    }
  }
}
