import { CommonService } from '@module/common/common.service';
import { BloodDto } from '@module/blood/dto/blood.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodFilterDto } from '@module/blood/dto/blood.filter.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Blood } from '../entity/blood.entity';
import { CODE_EXISTS } from '@config/constant';

@Injectable()
export class BloodService {
  constructor(@InjectRepository(Blood) private readonly bloodRepository: Repository<Blood>, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<Blood> {
    return await this.bloodRepository.findOne(query);
  }
  async getDetail(code: string) {
    try {
      const data = await this.findOne({
        where: { transactionCodes: code },
        relations: {
          bloodDetail: true,
          hospital: true,
        },
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async create(blood: BloodDto) {
    try {
      const check_code = await this.bloodRepository.findOne({ where: { transactionCodes: blood.transactionCodes } });
      if (check_code) throw new BadRequestException(CODE_EXISTS + ': ' + check_code.transactionCodes);
      const newData = await this.bloodRepository.save(blood);

      return newData;
    } catch (error) {
      return error;
    }
  }

  async update(blood: BloodDto, transactionCodes: string) {
    const result = await this.bloodRepository.findOne({
      where: { transactionCodes: transactionCodes },
    });

    if (!result) {
      throw new NotFoundException();
    }
    return await this.bloodRepository.save({ ...result, ...blood });
  }

  async find(body: BloodFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'blood',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
        },
      },
      relations: { bloodDetail: true },
    });
  }
}
