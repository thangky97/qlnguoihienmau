import { CommonService } from '@module/common/common.service';
import { BloodDetailDto } from '@module/blood_detail/dto/blood_detail.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodDetailFilterDto } from '@module/blood_detail/dto/blood_detail.filter.dto';
import { DataSource, FindOneOptions, Repository } from 'typeorm';

import { BloodDetail } from '../entity/blood_detail.entity';
import { Status } from '@config/enum';

@Injectable()
export class BloodDetailService {
  constructor(@InjectRepository(BloodDetail) private readonly bloodDetailRepository: Repository<BloodDetail>, private readonly dataSource: DataSource, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<BloodDetail> {
    return await this.bloodDetailRepository.findOne(query);
  }
  async getDetail(id: string) {
    try {
      const data = await this.findOne({ where: { id: id } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async create(bloodDetail: BloodDetailDto) {
    try {
      const newData = await this.bloodDetailRepository.save(bloodDetail);

      return newData;
    } catch (error) {
      return error;
    }
  }
  // tourname, adult_qty child_qty, inf_qty, adult_price, child_price, inf_price, note
  async update(bloodDetail: BloodDetailDto, id: number) {
    const result = await this.bloodDetailRepository.findOne({
      where: { id: id },
    });

    if (!result) {
      throw new NotFoundException();
    }
    return await this.bloodDetailRepository.save({ ...result, ...bloodDetail });
  }

  async find(body: BloodDetailFilterDto) {
    try {
      const data = await this.commonService.getTotalAndList({
        tableName: 'blood_detail',
        body: {
          ...body,
          filter: {
            transactionCode: body.filter.transactionCode,
            // bloodCode: body.filter.bloodCode,
            status: body.filter.status,
            blood: {
              bloodtype: body.filter.bloodtype,
            },
          },
        },
        relations: {
          blood: {
            hospital: true,
          },
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id: number) {
    const result = await this.bloodDetailRepository.findOne({
      where: { id },
    });

    await this.bloodDetailRepository.delete({
      id,
    });
    return result;
  }
}
