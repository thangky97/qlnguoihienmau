import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from '@module/hospital/entity/hospital.entity';
import { HospitalDto } from '@module/hospital/dto/hospital.dto';
import * as moment from 'moment';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { HospitalFilterDto } from '@module/hospital/dto/hospital.filter.dto';
import { Status } from '@config/enum';
import { HospitalUDDto } from '@module/hospital/dto/hospitalUD.dto';
import { HospitalQueryDto } from '../dto/hospital.query.dto';
import { DataSource } from 'typeorm'; // Import DataSource

@Injectable()
export class HospitalService {
  constructor(@InjectRepository(Hospital) private readonly hospitalRepository: Repository<Hospital>, private dataSource: DataSource, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<Hospital> {
    return await this.hospitalRepository.findOne(query);
  }

  async create(hospital: HospitalDto) {
    try {
      const newData = await this.hospitalRepository.save(hospital);
      return newData;
    } catch (error) {
      return error;
    }
  }

  async find(body: HospitalFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'hospital',
      body: {
        ...body,
        filter: {
          name: body.filter.name && Like(`%${body.filter.name}%`),
          status: body.filter.status,
        },
      },
    });
  }

  async findAll(@Query() query: HospitalQueryDto) {
    return await this.hospitalRepository.find({
      where: {
        status: Status.ACTIVE,
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

  async update(hospital: HospitalUDDto, id: number) {
    try {
      const result = await this.hospitalRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.hospitalRepository.save({ ...result, ...hospital });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id: number) {
    try {
      await this.hospitalRepository.delete({
        id,
      });
      await this.hospitalRepository.delete({ id: id });
    } catch (error) {
      console.log(error);
    }
  }
}
