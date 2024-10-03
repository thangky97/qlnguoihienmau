import { CommonService } from '@module/common/common.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from '@module/contract/entity/contract.entity';
import { ContractDto } from '@module/contract/dto/contract.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ExcelJS = require('exceljs');
import { FindOneOptions, Like, Raw, Repository } from 'typeorm';
import { ContractFilterDto } from '@module/contract/dto/contract.filter.dto';
import { ContractUDDto } from '@module/contract/dto/contractUD.dto';
import { Job } from '@module/job/entity/job.entity';
import { Task } from '@module/task/entity/task.entity';
import { ProcessingStatus, StatusContract, WorkStatus, WorkStatusJob, WorkStatusTask } from '@config/enum';

@Injectable()
export class ContractService {
  constructor(@InjectRepository(Contract) private readonly contractRepository: Repository<Contract>, private readonly commonService: CommonService, @InjectRepository(Job) private readonly jobRepository: Repository<Job>, @InjectRepository(Task) private readonly taskRepository: Repository<Task>) {}
  makeObjectQuery(startDate: Date, endDate: Date) {
    if (startDate && endDate) {
      return Raw((alias) => `${alias} >= :startDate and  ${alias} <= :endDate`, { startDate, endDate });
    } else if (startDate) {
      return Raw((alias) => `${alias} >= :startDate`, { startDate });
    } else if (endDate) {
      return Raw((alias) => `${alias} <= :endDate`, { endDate });
    }
  }

  async findOne(query: FindOneOptions): Promise<Contract> {
    return await this.contractRepository.findOne(query);
  }

  async create(contract: ContractDto) {
    try {
      const newContract = await this.contractRepository.save(contract);

      return newContract;
    } catch (error) {
      console.log(error);
    }
  }

  async find(body: ContractFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'contract',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
          workstatus: body.filter.workstatus,
          customer_code: body?.filter?.customer_code || undefined,
          user_code: body?.filter?.user_code || undefined,
        },
      },
    });
  }

  async findAll(query) {
    return await this.contractRepository.find({
      where: {
        name: query.name && Like(`%${query.name}%`),
        customer_code: query.customer_code,
        user_code: query.user_code,
        status: query.status,
        workstatus: query.workstatus,
        processingStatus: query?.processingStatus,
        created_at: (query.startDate || query.endDate) && this.makeObjectQuery(query.startDate, query.endDate),
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findAllTask(query) {
    const { id } = query;

    const contracts = await this.contractRepository.find({
      where: {
        id,
      },
      order: {
        id: 'DESC',
      },
    });

    return contracts;
  }

  async getDetail(id: number) {
    try {
      const data = await this.findOne({ where: { id: id } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async getJobcontract(id: number) {
    try {
      const data = await this.findOne({
        where: { id: id },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async update(contract: ContractUDDto, id: number) {
    // try {
    //   const result = await this.contractRepository.findOne({
    //     where: { id: id },
    //   });

    //   if (!result) {
    //     throw new NotFoundException();
    //   }
    //   return await this.contractRepository.save({ ...result, ...contract });
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      const existingContract = await this.contractRepository.findOne({
        where: { id: id },
      });

      if (!existingContract) {
        throw new NotFoundException(`contract with ID ${id} not found.`);
      }

      const updatedContract = await this.contractRepository.save({
        ...existingContract,
        ...contract,
      });

      return updatedContract;
    } catch (error) {
      throw new Error(error.message || 'An error occurred while updating the contract.');
    }
  }

  async import(file: Express.Multer.File) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const workSheet = workbook.getWorksheet('import_contract');

    const listContract: ContractDto[] = [];

    workSheet?._rows?.forEach((item: any, index: number) => {
      if (index > 0 && item.getCell(1).value != null) {
        listContract.push({
          jobfield_id: item?.getCell(1).value.result || item?.getCell(1).value,
          inquiry_id: item?.getCell(2).value.result || item?.getCell(2).value,
          name: item?.getCell(3).value.result || item?.getCell(3).value,
          description: item?.getCell(4).value || '',
          customer_code: item?.getCell(5).value?.result || item?.getCell(5).value,
          user_code: item?.getCell(6).value?.result || item?.getCell(6).value,
          createDate: item?.getCell(7).value?.result || item?.getCell(7).value,
          status: item?.getCell(8).value?.result || item?.getCell(8).value,
          signing_date: item?.getCell(9).value || '',
          duration: item?.getCell(10).value || '',
          note: item?.getCell(11).value || '',
          contract_number_information: item?.getCell(12).value.result || item?.getCell(3).value,
        });
      }
    });

    for (let i = 0; i < listContract.length; i++) {
      await this.create(listContract[i]);
    }
  }

  // async delete(query: any) {
  //   try {
  //     const contractToDelete = await this.contractRepository.find({
  //       where: {
  //         id: query?.id,
  //       },
  //     });

  //     const jobToDelete = await this.jobRepository.find({
  //       where: {
  //         contract_id: query?.id,
  //       },
  //     });

  //     if (contractToDelete) {
  //       for (const jobs of jobToDelete) {
  //         const taskToDelete = await this.taskRepository.find({
  //           where: {
  //             job_id: jobs.id,
  //           },
  //         });
  //         for (const task of taskToDelete) {
  //           await this.taskRepository.remove(task);
  //         }

  //         // Sau đó xóa đơn đặt hàng
  //         await this.jobRepository.remove(jobs);
  //       }

  //       await this.contractRepository.delete({
  //         id: query?.id,
  //       });
  //       return 'ok';
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async delete(query: any) {
    try {
      // Cập nhật các job liên quan để hủy ràng buộc với contract
      await this.jobRepository.update({ contract_id: query?.id }, { contract_id: null });

      // Sau đó xóa contract
      await this.contractRepository.delete({
        id: query?.id,
      });

      return 'ok';
    } catch (error) {
      console.log(error);
      throw new Error('Không thể xóa hợp đồng.');
    }
  }

  // update task cua hop dong
  // get all job and task
  // update status cua job va task lien quan theo status cua contract
  mapContractStatusToJobStatus = (contractStatus: ProcessingStatus): WorkStatusJob => {
    switch (contractStatus) {
      case ProcessingStatus.CONTACT:
      case ProcessingStatus.Survey:
      case ProcessingStatus.NEGOTIATION:
        return WorkStatusJob.PROCESSING;

      case ProcessingStatus.SURNOTIMPLEMENTEDVEY:
      case ProcessingStatus.CONTRACT:
        return WorkStatusJob.COMPLETED;
      default:
        throw new BadRequestException(`Unsupported processing status: ${contractStatus}`);
    }
  };

  mapContractStatusToTaskStatus = (contractStatus: ProcessingStatus): WorkStatusTask => {
    switch (contractStatus) {
      case ProcessingStatus.CONTACT:
      case ProcessingStatus.Survey:
      case ProcessingStatus.NEGOTIATION:
        return WorkStatusTask.PROCESSING;

      case ProcessingStatus.SURNOTIMPLEMENTEDVEY:
      case ProcessingStatus.CONTRACT:
        return WorkStatusTask.COMPLETED;
      default:
        throw new BadRequestException(`Unsupported processing status: ${contractStatus}`);
    }
  };

  async updatetaskscontractstatus(contractId: number, status: ProcessingStatus) {
    try {
      const taskStatus = this.mapContractStatusToTaskStatus(status);

      //1. get job of contract
      const jobToUpdate = await this.jobRepository.findOne({
        where: {
          contract_id: contractId,
        },
      });
      // 2. Check if jobs exist
      if (jobToUpdate) {
        // get task of this job
        const tasks = await this.taskRepository.find({
          where: {
            job_id: jobToUpdate?.id,
          },
        });
        if (tasks && tasks.length > 0) {
          tasks.forEach((task) => {
            task.workstatus = taskStatus;
          });
          await this.taskRepository.save(tasks);
        }
        // 3. Update the status of each job
        jobToUpdate.workstatusJob = taskStatus;
        await this.jobRepository.save(jobToUpdate);
      }
      // 2. Get task contracts
      return true;
    } catch (error) {
      console.log(error);
      throw new Error('Không cập nhật được task và công việc.');
    }
  }
}
