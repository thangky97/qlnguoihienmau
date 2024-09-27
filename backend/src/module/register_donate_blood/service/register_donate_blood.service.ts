import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDonateBlood } from '@module/register_donate_blood/entity/register_donate_blood.entity';
import { RegisterDonateBloodDto } from '@module/register_donate_blood/dto/register_donate_blood.dto';

import { FindOneOptions, Repository } from 'typeorm';
import { RegisterDonateBloodFilterDto } from '@module/register_donate_blood/dto/register_donate_blood.filter.dto';
import { RegisterDonateBloodUDDto } from '@module/register_donate_blood/dto/register_donate_bloodUD.dto';
import { RegisterDonateBloodQueryDto } from '../dto/register_donate_blood.query.dto';

@Injectable()
export class RegisterDonateBloodService {
  constructor(@InjectRepository(RegisterDonateBlood) private readonly registerDonateBloodRepository: Repository<RegisterDonateBlood>, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<RegisterDonateBlood> {
    return await this.registerDonateBloodRepository.findOne(query);
  }

  async create(registerDonateBlood: RegisterDonateBloodDto) {
    try {
      const newData = await this.registerDonateBloodRepository.save(registerDonateBlood);
      return newData;
    } catch (error) {
      return error;
    }
  }

  async find(body: RegisterDonateBloodFilterDto) {
    try {
      return await this.commonService.getTotalAndList({
        tableName: 'register_donate_blood',
        body: {
          ...body,
          filter: {
            status: body.filter.status,
            // department_id: body?.filter?.department_id || undefined,
          },
        },
        relations: {
          customer: true,
          envent: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(@Query() query: RegisterDonateBloodQueryDto) {
    return await this.registerDonateBloodRepository.find({
      where: {},
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

  async update(registerDonateBlood: RegisterDonateBloodUDDto, id: number) {
    try {
      const result = await this.registerDonateBloodRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.registerDonateBloodRepository.save({ ...result, ...registerDonateBlood });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id: number) {
    try {
      const result = await this.findOne({ where: { id: id } });
      await this.registerDonateBloodRepository.delete({
        id,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
