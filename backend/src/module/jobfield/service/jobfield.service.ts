import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobfield } from '@module/jobfield/entity/jobfield.entity';
import { JobfieldDto } from '@module/jobfield/dto/jobfield.dto';

import { FindOneOptions, Repository } from 'typeorm';
import { JobfieldFilterDto } from '@module/jobfield/dto/jobfield.filter.dto';
import { ProcessingStatus, ProgressStatus, Status, WorkStatusJob } from '@config/enum';
import { JobfieldUDDto } from '@module/jobfield/dto/jobfieldUD.dto';
import { JobfieldQueryDto } from '../dto/jobfield.query.dto';
import { Inquiry } from '@module/inquiry/entity/inquiry.entity';
import { Contract } from '@module/contract/entity/contract.entity';
import { Job } from '@module/job/entity/job.entity';
import { Task } from '@module/task/entity/task.entity';
import { Workingprocesstemplate } from '@module/workingprocesstemplate/entity/workingprocesstemplate.entity';

@Injectable()
export class JobfieldService {
  constructor(
    @InjectRepository(Jobfield) private readonly jobfieldRepository: Repository<Jobfield>,
    @InjectRepository(Inquiry) private readonly inquiryRepository: Repository<Inquiry>,
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(Workingprocesstemplate) private readonly workingprocesstemplateRepository: Repository<Workingprocesstemplate>,
    private readonly commonService: CommonService,
  ) {}

  async findOne(query: FindOneOptions): Promise<Jobfield> {
    return await this.jobfieldRepository.findOne(query);
  }

  async create(jobfield: JobfieldDto) {
    try {
      const newJobfield = await this.jobfieldRepository.save(jobfield);
      return newJobfield;
    } catch (error) {
      return error;
    }
  }

  async find(body: JobfieldFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'jobfield',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
        },
      },
    });
  }

  async findAll(@Query() query: JobfieldQueryDto) {
    return await this.jobfieldRepository.find({
      where: {
        status: Status.ACTIVE,
      },
      relations: { workingprocesstemplate: true },
      order: {
        id: 'DESC',
      },
    });
  }
  // // async Statistical(@Query() query: any) {
  // //   const { startDate, endDate } = query;

  // //   // Lấy ngày đầu tiên và ngày cuối cùng của tháng hiện tại
  // //   const currentDate = new Date();
  // //   const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // //   const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // //   const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
  // //   const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

  // //   const start = startDate || defaultStartDate;
  // //   const end = endDate || defaultEndDate;

  // //   const jobfields = await this.jobfieldRepository.find();

  // //   const statistics = await this.InquiryRepository.createQueryBuilder('inquiry')
  // //     .select('inquiry.jobfield_id', 'jobfieldId')
  // //     .addSelect('inquiry.processingStatus', 'processingStatus')
  // //     .addSelect('COUNT(inquiry.id)', 'count')
  // //     .where('inquiry.created_at >= :start', { start })
  // //     .andWhere('inquiry.created_at <= :end', { end })
  // //     .groupBy('inquiry.jobfield_id')
  // //     .addGroupBy('inquiry.processingStatus')
  // //     .getRawMany();

  // //   const result = jobfields.map((jobfield) => {
  // //     const jobfieldStatistics = statistics.filter((stat) => stat.jobfieldId === jobfield.id);

  // //     const processingStatusCounts = Object.values(ProcessingStatus).reduce((acc, status) => {
  // //       acc[status as ProcessingStatus] = 0;
  // //       return acc;
  // //     }, {} as Record<ProcessingStatus, number>);

  // //     jobfieldStatistics.forEach((stat) => {
  // //       processingStatusCounts[stat.processingStatus as ProcessingStatus] = parseInt(stat.count, 10);
  // //     });

  // //     const totalProcessingStatus = Object.values(processingStatusCounts).reduce((acc, count) => acc + count, 0);

  // //     return {
  // //       jobfieldName: jobfield.name,
  // //       totalProcessingStatus,
  // //       processingStatusCounts,
  // //     };
  // //   });

  // // }

  // async Statistical(@Query() query: any) {
  //   const { startDate, endDate } = query;

  //   // Lấy ngày đầu tiên và ngày cuối cùng của tháng hiện tại
  //   const currentDate = new Date();
  //   const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  //   const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  //   const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
  //   const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

  //   const start = startDate || defaultStartDate;
  //   const end = endDate || defaultEndDate;

  //   const jobfields = await this.jobfieldRepository.find();

  //   const statistics = await this.contractRepository.createQueryBuilder('contract')
  //     .select('contract.jobfield_id', 'jobfieldId')
  //     .addSelect('contract.processingStatus', 'processingStatus')
  //     .addSelect('COUNT(contract.id)', 'count')
  //     .where('contract.created_at >= :start', { start })
  //     .andWhere('contract.created_at <= :end', { end })
  //     .groupBy('contract.jobfield_id')
  //     .addGroupBy('contract.processingStatus')
  //     .getRawMany();

  //   const result = jobfields.map((jobfield) => {
  //     const jobfieldStatistics = statistics.filter((stat) => stat.jobfieldId === jobfield.id);

  //     const processingStatusCounts = Object.values(ProcessingStatus).reduce((acc, status) => {
  //       acc[status as ProcessingStatus] = 0;
  //       return acc;
  //     }, {} as Record<ProcessingStatus, number>);

  //     jobfieldStatistics.forEach((stat) => {
  //       processingStatusCounts[stat.processingStatus as ProcessingStatus] = parseInt(stat.count, 10);
  //     });

  //     const totalProcessingStatus = Object.values(processingStatusCounts).reduce((acc, count) => acc + count, 0);

  //     return {
  //       jobfieldName: jobfield.name,
  //       totalProcessingStatus,
  //       processingStatusCounts,
  //     };
  //   });
  //   return result;
  // }

  // async Statistical(@Query() query: any) {
  //   const { startDate, endDate } = query;

  //   const currentDate = new Date();
  //   const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  //   const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  //   const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
  //   const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

  //   const start = startDate ? new Date(startDate).toISOString() : defaultStartDate;
  //   const end = endDate ? new Date(endDate).toISOString() : defaultEndDate;

  //   const jobfields = await this.jobfieldRepository.find({
  //     where: {
  //       status: Status?.ACTIVE,
  //     },
  //   });

  //   const inquiryStatistics = await this.inquiryRepository
  //     .createQueryBuilder('inquiry')
  //     .select('inquiry.jobfield_id', 'jobfieldId')
  //     .addSelect('inquiry.processingStatus', 'processingStatus')
  //     .addSelect('COUNT(inquiry.id)', 'count')
  //     .where('inquiry.created_at >= :start AND inquiry.created_at <= :end', { start, end })
  //     .andWhere('inquiry.status = :status', { status: 'ACTIVE' })
  //     .groupBy('inquiry.jobfield_id')
  //     .addGroupBy('inquiry.processingStatus')
  //     .getRawMany();

  //   const contractStatistics = await this.contractRepository
  //     .createQueryBuilder('contract')
  //     .select('contract.jobfield_id', 'jobfieldId')
  //     .addSelect('contract.processingStatus', 'processingStatus')
  //     .addSelect('COUNT(contract.id)', 'count')
  //     .where('contract.created_at >= :start', { start })
  //     .andWhere('contract.created_at <= :end', { end })
  //     .groupBy('contract.jobfield_id')
  //     .addGroupBy('contract.processingStatus')
  //     .getRawMany();

  //   const totalInquiryCounts = Object.values(ProcessingStatus).reduce((acc, status) => {
  //     acc[status as ProcessingStatus] = 0;
  //     return acc;
  //   }, {} as Record<ProcessingStatus, number>);

  //   inquiryStatistics.forEach((stat) => {
  //     totalInquiryCounts[stat.processingStatus as ProcessingStatus] += parseInt(stat.count, 10);
  //   });

  //   const totalInquiryProcessingStatus = Object.values(totalInquiryCounts).reduce((acc, count) => acc + count, 0);

  //   const totalContractCounts = Object.values(ProcessingStatus).reduce((acc, status) => {
  //     acc[status as ProcessingStatus] = 0;
  //     return acc;
  //   }, {} as Record<ProcessingStatus, number>);

  //   contractStatistics.forEach((stat) => {
  //     totalContractCounts[stat.processingStatus as ProcessingStatus] += parseInt(stat.count, 10);
  //   });

  //   const totalContractProcessingStatus = Object.values(totalContractCounts).reduce((acc, count) => acc + count, 0);

  //   const result = {
  //     inquiryStatistics: jobfields.map((jobfield) => {
  //       const jobfieldStatistics = inquiryStatistics.filter((stat) => stat.jobfieldId === jobfield.id);

  //       const processingStatusCounts = Object.values(ProcessingStatus).reduce((acc, status) => {
  //         acc[status as ProcessingStatus] = 0;
  //         return acc;
  //       }, {} as Record<ProcessingStatus, number>);

  //       jobfieldStatistics.forEach((stat) => {
  //         processingStatusCounts[stat.processingStatus as ProcessingStatus] = parseInt(stat.count, 10);
  //       });

  //       const totalProcessingStatus = Object.values(processingStatusCounts).reduce((acc, count) => acc + count, 0);

  //       return {
  //         jobfieldName: jobfield.name,
  //         jobfieldId: jobfield.id,
  //         totalProcessingStatus,
  //         processingStatusCounts,
  //       };
  //     }),

  //     contractStatistics: jobfields.map((jobfield) => {
  //       const jobfieldStatistics = contractStatistics.filter((stat) => stat.jobfieldId === jobfield.id);

  //       const processingStatusCounts = Object.values(ProcessingStatus).reduce((acc, status) => {
  //         acc[status as ProcessingStatus] = 0;
  //         return acc;
  //       }, {} as Record<ProcessingStatus, number>);

  //       jobfieldStatistics.forEach((stat) => {
  //         processingStatusCounts[stat.processingStatus as ProcessingStatus] = parseInt(stat.count, 10);
  //       });

  //       const totalProcessingStatus = Object.values(processingStatusCounts).reduce((acc, count) => acc + count, 0);

  //       return {
  //         jobfieldId: jobfield.id,
  //         jobfieldName: jobfield.name,
  //         totalProcessingStatus,
  //         processingStatusCounts,
  //       };
  //     }),

  //     totakInqueryCounts: {
  //       labels: ['ĐANG THỰC HIỆN', 'VƯỚNG MẮC', 'QUÁ HẠN', 'HOÀN THÀNH', 'ĐÃ THANH TOÁN', 'SL NHU CẦU'],
  //       data: [...Object.values(totalInquiryCounts), totalInquiryProcessingStatus],
  //     },
  //     totalContractCounts: {
  //       labels: ['ĐANG THỰC HIỆN', 'VƯỚNG MẮC', 'QUÁ HẠN', 'HOÀN THÀNH', 'ĐÃ THANH TOÁN', 'SL HỢP ĐỒNG'],
  //       data: [...Object.values(totalContractCounts), totalContractProcessingStatus],
  //     },
  //   };

  //   return result;
  // }

  async Statistical(@Query() query: any) {
    const { startDate, endDate } = query;

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
    const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

    const start = startDate ? new Date(startDate).toISOString() : defaultStartDate;
    const end = endDate ? new Date(endDate).toISOString() : defaultEndDate;

    const jobfields = await this.jobfieldRepository.find({
      where: {
        status: Status?.ACTIVE,
      },
    });

    const inquiryStatistics = await this.inquiryRepository
      .createQueryBuilder('inquiry')
      .select('inquiry.jobfield_id', 'jobfieldId')
      .addSelect('inquiry.processingStatus', 'processingStatus')
      .addSelect('COUNT(inquiry.id)', 'count')
      .where('inquiry.created_at >= :start AND inquiry.created_at <= :end', { start, end })
      .andWhere('inquiry.status = :status', { status: 'ACTIVE' })
      .groupBy('inquiry.jobfield_id')
      .addGroupBy('inquiry.processingStatus')
      .getRawMany();

    const contractStatistics = await this.contractRepository
      .createQueryBuilder('contract')
      .select('contract.jobfield_id', 'jobfieldId')
      .addSelect('contract.processingStatus', 'processingStatus')
      .addSelect('COUNT(contract.id)', 'count')
      .where('contract.created_at >= :start', { start })
      .andWhere('contract.created_at <= :end', { end })
      .groupBy('contract.jobfield_id')
      .addGroupBy('contract.processingStatus')
      .getRawMany();

    return {
      jobfields,
      inquiryStatistics,
      contractStatistics,
    };
  }

  async StatisticalJob(@Query() query: any) {
    try {
      const { startDate, endDate } = query;

      // Lấy ngày đầu tiên và ngày cuối cùng của tháng hiện tại
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Chuyển đổi ngày đầu tiên và ngày cuối cùng của tháng hiện tại sang định dạng YYYY-MM-DD
      const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
      const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

      // Sử dụng giá trị startDate và endDate từ query hoặc sử dụng giá trị mặc định

      const start = startDate ? new Date(startDate).toISOString() : defaultStartDate;
      const end = endDate ? new Date(endDate).toISOString() : defaultEndDate;

      const jobfields = await this.jobfieldRepository.find({
        where: {
          status: Status?.ACTIVE,
        },
      });

      // Truy vấn thống kê từ Job
      const jobStatistics = await this.jobRepository
        .createQueryBuilder('job')
        .select('job.jobfield_id', 'jobfieldId')
        .addSelect('job.workstatusJob', 'workstatusJob')
        .addSelect('job.id', 'jobId')
        .where('job.created_at >= :start AND job.created_at <= :end', { start, end })
        .groupBy('job.jobfield_id')
        .addGroupBy('job.workstatusJob')
        .addGroupBy('job.id')
        .getRawMany();

      // Lấy thông tin chi tiết của các công việc để tính toán trạng thái tiến độ
      const jobDetails = await Promise.all(
        jobStatistics.map(async (jobStat) => {
          const job = await this.jobRepository.findOne({
            where: { id: jobStat.jobId },
            relations: { task: true },
          });

          const maxdate = job.task.reduce((max, task) => {
            const taskDate = new Date(task.processDate);
            const dealineDays = task.dealine;
            taskDate.setDate(taskDate.getDate() + dealineDays);
            return taskDate > max ? taskDate : max;
          }, new Date(0));

          const maxdateUpdate = job.task.reduce((max, task) => {
            const taskUpdatedDate = new Date(task.updated_at);
            return taskUpdatedDate > max ? taskUpdatedDate : max;
          }, new Date(0));

          return {
            ...jobStat,
            maxdate,
            maxdateUpdate,
          };
        }),
      );

      return {
        jobfields,
        jobDetails,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async getDetail(id: number) {
    try {
      const data = await this.findOne({ where: { id: id } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async update(jobfield: JobfieldUDDto, id: number) {
    try {
      const result = await this.jobfieldRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.jobfieldRepository.save({ ...result, ...jobfield });
    } catch (error) {
      console.log(error);
    }
  }

  // async delete(id: number) {
  //   try {
  //     const result = await this.findOne({ where: { id: id } });
  //     await this.jobfieldRepository.delete({
  //       id,
  //     });
  //     return result;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async delete(id: number) {
    try {
      // Find and update related entities to set the jobfield_id to null
      await this.workingprocesstemplateRepository.update({ jobfield: { id } }, { jobfield_id: null });
      await this.jobRepository.update({ jobfield: { id } }, { jobfield_id: null });
      await this.taskRepository.update({ jobfield: { id } }, { jobfield_id: null });
      await this.inquiryRepository.update({ jobfield: { id } }, { jobfield_id: null });
      await this.contractRepository.update({ jobfield: { id } }, { jobfield_id: null });

      // Now you can safely delete the jobfield
      const result = await this.findOne({ where: { id } });
      await this.jobfieldRepository.delete({ id });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
