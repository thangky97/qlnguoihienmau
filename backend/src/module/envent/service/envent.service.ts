import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Envent } from '@module/envent/entity/envent.entity';
import { EnventDto } from '@module/envent/dto/envent.dto';

import { FindOneOptions, Like, Repository } from 'typeorm';
import { EnventFilterDto } from '@module/envent/dto/envent.filter.dto';
import { Status } from '@config/enum';
import { EnventUDDto } from '@module/envent/dto/enventUD.dto';

@Injectable()
export class EnventService {
  constructor(@InjectRepository(Envent) private readonly enventRepository: Repository<Envent>, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<Envent> {
    return await this.enventRepository.findOne(query);
  }

  async create(envent: EnventDto) {
    try {
      const newEnvent = await this.enventRepository.save(envent);
      return newEnvent;
    } catch (error) {
      return error;
    }
  }

  async find(body: EnventFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'envent',
      body: {
        ...body,
        filter: {
          // status: body.filter.status,
          // jobfield_id: body?.filter?.jobfield_id || undefined,
          // department_id: body?.filter?.department_id || undefined,
        },
      },
      relations: {
        jobfield: true,
        departmentld: true,
      },
    });
  }

  async findAll(query) {
    return await this.enventRepository.find({
      where: {
        // name: query.name && Like(`%${query.name}%`),
        // jobfield_id: query.jobfield_id,
        status: query.status,
        // department_id: query?.department_id,
      },
      relations: {
        // jobfield: true,
        // departmentld: true,
      },
      order: {
        // sequence: 'ASC',
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

  async update(envent: EnventUDDto, id: number) {
    try {
      const result = await this.enventRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.enventRepository.save({ ...result, ...envent });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id: number) {
    try {
      const result = await this.findOne({ where: { id: id } });
      await this.enventRepository.delete({
        id,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
