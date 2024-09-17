import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workingprocesstemplate } from '@module/workingprocesstemplate/entity/workingprocesstemplate.entity';
import { WorkingprocesstemplateDto } from '@module/workingprocesstemplate/dto/workingprocesstemplate.dto';

import { FindOneOptions, Like, Repository } from 'typeorm';
import { WorkingprocesstemplateFilterDto } from '@module/workingprocesstemplate/dto/workingprocesstemplate.filter.dto';
import { Status } from '@config/enum';
import { WorkingprocesstemplateUDDto } from '@module/workingprocesstemplate/dto/workingprocesstemplateUD.dto';

@Injectable()
export class WorkingprocesstemplateService {
  constructor(@InjectRepository(Workingprocesstemplate) private readonly workingprocesstemplateRepository: Repository<Workingprocesstemplate>, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<Workingprocesstemplate> {
    return await this.workingprocesstemplateRepository.findOne(query);
  }

  async create(workingprocesstemplate: WorkingprocesstemplateDto) {
    try {
      const newWorkingprocesstemplate = await this.workingprocesstemplateRepository.save(workingprocesstemplate);
      return newWorkingprocesstemplate;
    } catch (error) {
      return error;
    }
  }

  async find(body: WorkingprocesstemplateFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'workingprocesstemplate',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
          jobfield_id: body?.filter?.jobfield_id || undefined,
          department_id: body?.filter?.department_id || undefined,
        },
      },
      relations: {
        jobfield: true,
        departmentld: true,
      },
    });
  }

  async findAll(query) {
    return await this.workingprocesstemplateRepository.find({
      where: {
        // name: query.name && Like(`%${query.name}%`),
        jobfield_id: query.jobfield_id,
        status: query.status,
        department_id: query?.department_id,
      },
      relations: {
        jobfield: true,
        departmentld: true,
      },
      order: {
        sequence: 'ASC',
      },
    });
  }

  async getDetail(id: number) {
    try {
      const data = await this.findOne({ where: { id: id }, relations: { jobfield: true, departmentld: true } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async update(workingprocesstemplate: WorkingprocesstemplateUDDto, id: number) {
    try {
      const result = await this.workingprocesstemplateRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.workingprocesstemplateRepository.save({ ...result, ...workingprocesstemplate });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id: number) {
    try {
      const result = await this.findOne({ where: { id: id } });
      await this.workingprocesstemplateRepository.delete({
        id,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
