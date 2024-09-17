import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '@module/company/entity/company.entity';
import { CompanyDto } from '@module/company/dto/company.dto';
import { CompanyFilterDto } from '@module/company/dto/company.filter.dto';
import { CompanyUDDto } from '@module/company/dto/companyUD.dto';
import { FindOneOptions, Like, Not, Repository } from 'typeorm';
import { Status } from '@config/enum';
import { User } from '@module/user/entity/user.entity';

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private readonly companyRepository: Repository<Company>, private readonly commonService: CommonService, @InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findOne(query: FindOneOptions): Promise<Company> {
    return await this.companyRepository.findOne(query);
  }
  async getDetail(id: number) {
    try {
      const data = await this.findOne({ where: { id: id } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async getDetailCustomer(id: number) {
    try {
      const data = await this.findOne({ where: { id: id } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async create(company: CompanyDto) {
    try {
      const newCompany = await this.companyRepository.save(company);
      return newCompany;
    } catch (error) {
      return error;
    }
  }

  async update(Company: CompanyUDDto, id: number) {
    const result = await this.companyRepository.findOne({
      where: { id: id },
    });

    if (!result) {
      throw new NotFoundException();
    }
    return await this.companyRepository.save({ ...result, ...Company });
  }

  async find(body: CompanyFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'company',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
        },
      },
      // relations: { authorities: true },
    });
  }

  async findAll() {
    return await this.companyRepository.find({
      where: {
        status: Status.ACTIVE,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findCompanyCustomer() {
    return await this.companyRepository.find({
      where: {
        status: Status.ACTIVE,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async delete(id: number) {
    try {
      await this.companyRepository.delete({
        id,
      });
      await this.userRepository.delete({ company_id: id });
    } catch (error) {
      console.log(error);
    }
  }
}
