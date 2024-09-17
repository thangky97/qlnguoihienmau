import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '@module/task/entity/task.entity';
import { TaskDto } from '@module/task/dto/task.dto';

import { FindOneOptions, Like, Raw, Repository } from 'typeorm';
import { TaskFilterDto } from '@module/task/dto/task.filter.dto';
import { TaskUDDto } from '@module/task/dto/taskUD.dto';
import { endOfMonth, startOfMonth } from 'date-fns';
import { WorkStatusTask } from '@config/enum';
import { Job } from '@module/job/entity/job.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>, @InjectRepository(Job) private readonly jobRepository: Repository<Job>, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<Task> {
    return await this.taskRepository.findOne(query);
  }

  async create(task: TaskDto) {
    try {
      const newTask = await this.taskRepository.save(task);
      return newTask;
    } catch (error) {
      return error;
    }
  }

  async find(body: TaskFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'task',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
          jobfield_id: body?.filter?.jobfield_id || undefined,
          job_id: body?.filter?.job_id || undefined,
        },
      },
      relations: { jobfield: true, job: { contract: true }, department: true },
    });
  }

  async findAll(query) {
    return await this.taskRepository.find({
      where: {
        // taskname: query.taskname && Like(`%${query.taskname}%`),
        // jobfield_id: query.jobfield_id,
        // job_id: query.job_id,
        // status: query.status,
        // workstatus: query.workstatus,
        taskname: query.taskname ? Like(`%${query.taskname}%`) : undefined,
        jobfield_id: query.jobfield_id ? query.jobfield_id : undefined,
        job_id: query.job_id ? query.job_id : undefined,
        department_id: query.department_id ? query.department_id : undefined,  // Add department_id filter
        status: query.status ? query.status : undefined,
        workstatus: query.workstatus ? query.workstatus : undefined,
      },
      relations: {
        jobfield: {
          workingprocesstemplate: true,
        },
        job: {
          contract: {
            customer: true,
          },
        },
        department: true,
      },
      order: {
        sequence: 'ASC',
        // id: 'desc',
      },
    });
  }

  async getDetail(id: number) {
    try {
      const data = await this.findOne({ where: { id: id }, relations: { jobfield: true, job: true, department: true } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async update(task: TaskUDDto, id: number) {
    try {
      const result = await this.taskRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      const data = await this.taskRepository.save({ ...result, ...task });
      if (data) {
        const jobDetail = await this.jobRepository.findOne({
          where: {
            id: data?.job_id,
          },
          relations: { task: true },
        });

        // Kiểm tra và cập nhật trạng thái workstatus của job
        if (jobDetail) {
          const tasks = jobDetail.task;

          // Kiểm tra trạng thái của tất cả các task
          const allCompleted = tasks.every((t) => t.workstatus === 'COMPLETED');
          const allNoProcess = tasks.every((t) => t.workstatus === 'NOPROCESS');

          if (allCompleted) {
            // jobDetail.workstatus = 'COMPLETED';
            await this.jobRepository.save({ ...jobDetail, workstatusJob: WorkStatusTask.COMPLETED });
          } else if (allNoProcess) {
            // jobDetail.workstatus = 'NOPROCESS';
            await this.jobRepository.save({ ...jobDetail, workstatusJob: WorkStatusTask.NOPROCESS });
          } else {
            await this.jobRepository.save({ ...jobDetail, workstatusJob: WorkStatusTask.PROCESSING });
          }
        }

        return jobDetail;
      }
    } catch (error) {
      console.log(error);
    }
  }

  makeObjectQuery(startDate: Date, endDate: Date) {
    if (startDate && endDate) {
      return Raw((alias) => `${alias} >= :startDate and  ${alias} <= :endDate`, { startDate, endDate });
    } else if (startDate) {
      return Raw((alias) => `${alias} >= :startDate`, { startDate });
    } else if (endDate) {
      return Raw((alias) => `${alias} <= :endDate`, { endDate });
    }
  }
  async findCountTaskByStatus(query) {
    const { startDate, endDate } = query;
    const useCustomDateRange = startDate || endDate;

    const currentStartDate = useCustomDateRange ? startDate : startOfMonth(new Date());
    const currentEndDate = useCustomDateRange ? endDate : endOfMonth(new Date());

    const countNOPROCESSPromise = this.taskRepository.count({
      where: {
        workstatus: WorkStatusTask.NOPROCESS,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countPROCESSINGPromise = this.taskRepository.count({
      where: {
        workstatus: WorkStatusTask.PROCESSING,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countCOMPLETEDPromise = this.taskRepository.count({
      where: {
        workstatus: WorkStatusTask.COMPLETED,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countCANCELPromise = this.taskRepository.count({
      where: {
        workstatus: WorkStatusTask.CANCEL,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const [countNOPROCESS, countPROCESSING, countCOMPLETED, countCANCEL] = await Promise.all([countNOPROCESSPromise, countPROCESSINGPromise, countCOMPLETEDPromise, countCANCELPromise]);

    return {
      labels: ['Chưa xử lý', 'Đang xử lý', 'Hoàn thành', 'Huỷ'],
      datasets: [
        {
          label: '# of Votes',
          data: [countNOPROCESS, countPROCESSING, countCOMPLETED, countCANCEL],
          backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    };
  }

  async findTaskByStatus(query) {
    const { startDate, endDate } = query;
    const useCustomDateRange = startDate || endDate;

    const currentStartDate = useCustomDateRange ? startDate : startOfMonth(new Date());
    const currentEndDate = useCustomDateRange ? endDate : endOfMonth(new Date());

    const countNOPROCESSPromise = this.taskRepository.find({
      where: {
        workstatus: WorkStatusTask.NOPROCESS,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countPROCESSINGPromise = this.taskRepository.find({
      where: {
        workstatus: WorkStatusTask.PROCESSING,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countCOMPLETEDPromise = this.taskRepository.find({
      where: {
        workstatus: WorkStatusTask.COMPLETED,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countCANCELPromise = this.taskRepository.find({
      where: {
        workstatus: WorkStatusTask.CANCEL,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const [countNOPROCESS, countPROCESSING, countCOMPLETED, countCANCEL] = await Promise.all([countNOPROCESSPromise, countPROCESSINGPromise, countCOMPLETEDPromise, countCANCELPromise]);

    return {
      countNOPROCESS,
      countPROCESSING,
      countCOMPLETED,
      countCANCEL,
    };
  }

  async delete(id: number) {
    try {
      const result = await this.findOne({ where: { id: id } });
      await this.taskRepository.delete({
        id,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
