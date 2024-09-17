import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from '@module/branch/entity/branch.entity';
import { BranchDto } from '@module/branch/dto/branch.dto';

import { FindOneOptions, Repository } from 'typeorm';
import { BranchFilterDto } from '@module/branch/dto/branch.filter.dto';
import { Status } from '@config/enum';
import { BranchUDDto } from '@module/branch/dto/branchUD.dto';
import { BranchQueryDto } from '../dto/branch.query.dto';

@Injectable()
export class BranchService {
  constructor(@InjectRepository(Branch) private readonly branchRepository: Repository<Branch>, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<Branch> {
    return await this.branchRepository.findOne(query);
  }

  async create(branch: BranchDto) {
    try {
      const newBranch = await this.branchRepository.save(branch);
      return newBranch;
    } catch (error) {
      return error;
    }
  }

  async find(body: BranchFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'branch',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
          company_id: body?.filter?.company_id || undefined,
        },
      },
      // relations: { authorities: true },
    });
  }

  async findAll(@Query() query: BranchQueryDto) {
    return await this.branchRepository.find({
      where: {
        status: Status.ACTIVE,
        company_id: query?.company_id || undefined,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getDetail(id: number) {
    try {
      const data = await this.findOne({ where: { id: id } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async update(branch: BranchUDDto, id: number) {
    try {
      const result = await this.branchRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.branchRepository.save({ ...result, ...branch });
    } catch (error) {
      console.log(error);
    }
  }
}
