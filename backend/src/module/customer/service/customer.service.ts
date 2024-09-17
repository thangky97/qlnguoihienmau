import { CommonService } from '@module/common/common.service';
import { CustomerDto } from '@module/customer/dto/customer.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerFilterDto } from '@module/customer/dto/customer.filter.dto';
import { CODE_EXISTS } from '@config/constant';
import { FindOneOptions, Like, Not, Repository } from 'typeorm';
import { Customer } from '../entity/customer.entity';
import { Role, Status } from '@config/enum';
import { CustomerQueryDto } from '@module/customer/dto/customer.query.dto';
import { Inquiry } from '@module/inquiry/entity/inquiry.entity';
import { Contract } from '@module/contract/entity/contract.entity';
import { Job } from '@module/job/entity/job.entity';
import { Task } from '@module/task/entity/task.entity';
import { NoteHistoryInquiry } from '@module/note_history_inquiry/entity/note_history_inquiry.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Inquiry) private readonly inquiryRepository: Repository<Inquiry>,
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(NoteHistoryInquiry) private readonly noteHistoryRepository: Repository<NoteHistoryInquiry>,
    private readonly commonService: CommonService,
  ) {}

  async findOne(query: FindOneOptions): Promise<Customer> {
    return await this.customerRepository.findOne(query);
  }
  async getDetail(code: string) {
    try {
      const data = await this.findOne({ where: { code: code } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async create(customer: CustomerDto) {
    try {
      const PREFIX_ID_USER = 'KH';
      const format_code = '00000';
      let generateId = PREFIX_ID_USER + '00001';

      // Find all customers with codes that match the PREFIX_ID_USER
      const filter_user = await this.customerRepository.find({
        where: {
          code: Like(`%${PREFIX_ID_USER}%`),
        },
      });

      if (filter_user.length > 0) {
        // Get the last index from the last customer in the filtered list
        const last_index = Number(filter_user[filter_user.length - 1].code.replace(PREFIX_ID_USER, '')) + 1;
        generateId = PREFIX_ID_USER + format_code.substring(0, 5 - last_index.toString().length) + last_index;
      }

      // Check if a customer with the provided code already exists
      const check_code = await this.customerRepository.findOne({
        where: { code: generateId },
      });
      if (check_code) {
        throw new BadRequestException(CODE_EXISTS);
      }

      // Save the new customer with the generated code
      const newCustomer = await this.customerRepository.save({ ...customer, code: generateId });

      if (newCustomer) {
        const newNoteHistory = this.noteHistoryRepository.create({
          customer_id: newCustomer.id,
          thoigianhienmau: newCustomer.created_at,
          luongmauhien: newCustomer?.luongmauhien,
        });

        await this.noteHistoryRepository.save(newNoteHistory);

        return newCustomer;
      }

      return null;
    } catch (error) {
      return error;
    }
  }

  async createCustomer(customer: CustomerDto) {
    try {
      const PREFIX_ID_USER = 'KH';
      const format_code = '00000';
      let generateId = PREFIX_ID_USER + '00001';

      // Find all customers with codes that match the PREFIX_ID_USER
      const filter_user = await this.customerRepository.find({
        where: {
          code: Like(`%${PREFIX_ID_USER}%`),
        },
      });

      if (filter_user.length > 0) {
        // Get the last index from the last customer in the filtered list
        const last_index = Number(filter_user[filter_user.length - 1].code.replace(PREFIX_ID_USER, '')) + 1;
        generateId = PREFIX_ID_USER + format_code.substring(0, 5 - last_index.toString().length) + last_index;
      }

      // Check if a customer with the provided code already exists
      const check_code = await this.customerRepository.findOne({
        where: { code: generateId },
      });
      if (check_code) {
        throw new BadRequestException(CODE_EXISTS);
      }

      // Save the new customer with the generated code
      const newCustomer = await this.customerRepository.save({ ...customer, code: generateId });

      if (newCustomer) {
        const newNoteHistory = this.noteHistoryRepository.create({
          customer_id: newCustomer.id,
          thoigianhienmau: newCustomer.created_at,
          luongmauhien: newCustomer?.luongmauhien,
        });

        await this.noteHistoryRepository.save(newNoteHistory);

        return newCustomer;
      }

      return null;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(query: CustomerQueryDto) {
    return await this.customerRepository.find({
      where: { status: Status.ACTIVE },

      order: {
        id: 'DESC',
      },
    });
  }

  async update(Customer: CustomerDto, code: string) {
    const result = await this.customerRepository.findOne({
      where: { code: code },
    });

    if (!result) {
      throw new NotFoundException();
    }
    return await this.customerRepository.save({ ...result, ...Customer });
  }

  async find(body: CustomerFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'customer',
      body: {
        ...body,
        filter: {
          name: body.filter.name && Like(`%${body.filter.name}%`),
          email: body.filter.email && Like(`%${body.filter.email}%`),
          phone: body.filter.phone && Like(`%${body.filter.phone}%`),
          status: body.filter.status,
        },
      },
    });
  }

  async delete(query: any) {
    try {
      const inquiryToDelete = await this.inquiryRepository.find({
        where: {
          customer_code: query?.code,
        },
      });

      const contractToDelete = await this.contractRepository.find({
        where: {
          customer_code: query?.code,
        },
      });

      for (const contract of contractToDelete) {
        const jobToDelete = await this.jobRepository.find({
          where: {
            contract_id: contract.id,
          },
        });

        for (const job of jobToDelete) {
          const taskToDelete = await this.taskRepository.find({
            where: {
              job_id: job.id,
            },
          });

          for (const task of taskToDelete) {
            await this.taskRepository.remove(task);
          }
        }

        for (const job of jobToDelete) {
          await this.jobRepository.remove(job);
        }

        await this.contractRepository.remove(contract);
      }
      for (const inquiry of inquiryToDelete) {
        await this.inquiryRepository.remove(inquiry);
      }

      await this.customerRepository.delete({
        code: query?.code,
      });
      return 'ok';
    } catch (error) {
      console.log(error);
    }
  }
}
