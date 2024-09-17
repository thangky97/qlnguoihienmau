import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from '@module/department/entity/department.entity';
import { DepartmentDto } from '@module/department/dto/department.dto';
import * as moment from 'moment';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { DepartmentFilterDto } from '@module/department/dto/department.filter.dto';
import { Status } from '@config/enum';
import { DepartmentUDDto } from '@module/department/dto/departmentUD.dto';
import { DepartmentQueryDto } from '../dto/department.query.dto';
import { Task } from '@module/task/entity/task.entity';
import { Job } from '@module/job/entity/job.entity';
import { Workingprocesstemplate } from '@module/workingprocesstemplate/entity/workingprocesstemplate.entity';
import { User } from '@module/user/entity/user.entity';
import { DataSource } from 'typeorm';  // Import DataSource


@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(Workingprocesstemplate) private readonly workingprocesstemplateRepository: Repository<Workingprocesstemplate>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly commonService: CommonService,
  ) {}

  async findOne(query: FindOneOptions): Promise<Department> {
    return await this.departmentRepository.findOne(query);
  }

  async create(department: DepartmentDto) {
    try {
      const newDepartment = await this.departmentRepository.save(department);
      return newDepartment;
    } catch (error) {
      return error;
    }
  }

  async find(body: DepartmentFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'department',
      body: {
        ...body,
        filter: {
          name: body.filter.name && Like(`%${body.filter.name}%`),
          status: body.filter.status,
        },
      },
    });
  }

  async findAll(@Query() query: DepartmentQueryDto) {
    return await this.departmentRepository.find({
      where: {
        status: Status.ACTIVE,
      },
      order: {
        id: 'DESC',
      },
    });
  }
  // async StatisticalTask(@Query() query: any) {
  //   try {
  //     const { startDate, endDate } = query;

  //     const currentDate = new Date();
  //     const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  //     const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  //     const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
  //     const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

  //     const start = startDate ? new Date(startDate).toISOString() : defaultStartDate;
  //     const end = endDate ? new Date(endDate).toISOString() : defaultEndDate;

  //     const departmentStatistics = await this.departmentRepository
  //       .createQueryBuilder('department')
  //       .select(['department.id', 'department.name'])
  //       .leftJoinAndSelect('department.department', 'user')
  //       .where('department.created_at >= :start AND department.created_at <= :end', { start, end })
  //       .andWhere('department.status = :status', { status: 'ACTIVE' })
  //       .getMany();

  //     const taskStatistics = await this.taskRepository.createQueryBuilder('task').select(['task.user_code', 'task.workstatus']).where('task.status = :status', { status: 'ACTIVE' }).getMany();

  //     // Khởi tạo biến để lưu trữ kết quả thống kê
  //     const result = [];
  //     const totalCounts = { NOPROCESS: 0, COMPLETED: 0, PROCESSING: 0, CANCEL: 0 };

  //     for (const department of departmentStatistics) {
  //       const departmentCounts = {
  //         departmentName: department.name,
  //         NOPROCESS: 0,
  //         COMPLETED: 0,
  //         PROCESSING: 0,
  //         CANCEL: 0,
  //       };

  //       // Đếm trạng thái công việc của từng user trong department
  //       for (const user of department.department) {
  //         for (const task of taskStatistics) {
  //           if (task.user_code === user.code) {
  //             if (task.workstatus in departmentCounts) {
  //               departmentCounts[task.workstatus]++;
  //               totalCounts[task.workstatus]++;
  //             }
  //           }
  //         }
  //       }

  //       result.push(departmentCounts);
  //     }

  //     // Tạo đối tượng tổng số lượng các trạng thái
  //     const totalContractCounts = {
  //       labels: ['CHƯA XỬ LÝ', 'ĐANG XỬ LÝ', 'HOÀN THÀNH', 'HỦY'],
  //       datasets: [
  //         {
  //           label: '# of Votes',
  //           data: [totalCounts.NOPROCESS, totalCounts.PROCESSING, totalCounts.COMPLETED, totalCounts.CANCEL],
  //           backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(120, 120, 120, 0.2)', 'rgba(106, 90, 205, 0.2)'],
  //           borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(120, 120, 120, 1)', 'rgba(106, 90, 205, 1)'],
  //           borderWidth: 1,
  //         },
  //       ],
  //     };

  //     // Thêm tổng hợp dữ liệu vào kết quả

  //     return { result, totalContractCounts };
  //   } catch (error) {
  //     console.log('====================================');
  //     console.log(error);
  //     console.log('====================================');
  //   }
  // }

  async StatisticalTask(@Query() query: any) {
    try {
      const { startDate, endDate } = query;

      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
      const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

      const start = startDate ? new Date(startDate).toISOString() : defaultStartDate;
      const end = endDate ? new Date(endDate).toISOString() : defaultEndDate;

      const departmentStatistics = await this.departmentRepository
        .createQueryBuilder('department')
        .select(['department.id', 'department.name'])
        .leftJoinAndSelect('department.task', 'task')
        .where('task.processDate >= :start AND task.processDate <= :end', { start, end })
        .andWhere('department.status = :status', { status: 'ACTIVE' })
        .getMany();

        const taskStatistics = await this.taskRepository.createQueryBuilder('task')
        .select(['task.department_id', 'task.workstatus'])
        .where('task.status = :status', { status: 'ACTIVE' })
        .andWhere('task.processDate >= :start', { start })
        .andWhere('task.processDate <= :end', { end })
        .getMany();
      

      // Khởi tạo biến để lưu trữ kết quả thống kê
      return {
        departments: departmentStatistics,
        tasks: taskStatistics,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async StatisticalJob(@Query() query: any) {
    try {
      const { startDate, endDate } = query;

      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
      const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

      const start = startDate ? new Date(startDate).toISOString() : defaultStartDate;
      const end = endDate ? new Date(endDate).toISOString() : defaultEndDate;

      const departmentStatistics = await this.departmentRepository
        .createQueryBuilder('department')
        .select(['department.id', 'department.name'])
        .leftJoinAndSelect('department.department', 'user')
        .where('department.created_at >= :start AND department.created_at <= :end', { start, end })
        .andWhere('department.status = :status', { status: 'ACTIVE' })
        .getMany();

      const jobStatistics = await this.jobRepository.createQueryBuilder('job').select(['job.user_code', 'job.workstatusJob']).getMany();
      return {
        departments: departmentStatistics,
        tasks: jobStatistics,
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

  // async report(id: number) {
  //   try {
  //     const data = await this.findOne({
  //       where: { id: id },
  //       relations: {
  //         department: {
  //           task: true,
  //         },
  //       },
  //     });
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // async report(@Query() query: any) {
  //   const { startDate, endDate, id } = query;

  //   if (!id) {
  //     return [];
  //   }

  //   try {
  //     const department = await this.findOne({
  //       where: { id },
  //       relations: ['department.task'],
  //     });

  //     if (!department) {
  //       throw new Error('Department not found');
  //     }

  //     const taskStatusByUser = department.department.map((user) => {
  //       const taskCounts = {
  //         userName: user.name,
  //         departmentName: department.name,
  //         total: 0,
  //         overdue: 0,
  //         normal: 0,
  //         overduePercentage: 0,
  //         normalPercentage: 0,
  //         tasks: [],
  //       };

  //       user.task.forEach((task) => {
  //         const processDate = moment(task?.processDate).add(task?.dealine, 'days').format('YYYY-MM-DD').toString();

  //         const includeTask = (!startDate && !endDate) || (startDate && endDate && moment(processDate).isBetween(startDate, endDate, undefined, '[]'));

  //         if (includeTask) {
  //           const updateDate = moment(task?.updated_at).format('YYYY-MM-DD').toString();
  //           const currentDate = moment(new Date()).format('YYYY-MM-DD').toString();
  //           let status;
  //           if (updateDate > processDate && task.workstatus === 'COMPLETED') {
  //             taskCounts.overdue++;
  //             status = 'Quá hạn';
  //           } else if (currentDate > processDate && (task.workstatus === 'NOPROCESS' || task.workstatus === 'PROCESSING')) {
  //             taskCounts.overdue++;
  //             status = 'Quá hạn';
  //           } else if (processDate >= currentDate && task.workstatus === 'COMPLETED') {
  //             taskCounts.overdue++;
  //             status = 'Đúng hạn';
  //           } else {
  //             taskCounts.normal++;
  //             status = 'Bình thường';
  //           }

  //           taskCounts.tasks.push({
  //             taskId: task.id,
  //             taskName: task.taskname,
  //             completionDate: processDate,
  //             status: status,
  //           });

  //           taskCounts.total++;
  //         }
  //       });

  //       if (taskCounts.total > 0) {
  //         taskCounts.overduePercentage = parseFloat(((taskCounts.overdue / taskCounts.total) * 100).toFixed(2));
  //         taskCounts.normalPercentage = parseFloat(((taskCounts.normal / taskCounts.total) * 100).toFixed(2));
  //       }

  //       return taskCounts;
  //     });

  //     return taskStatusByUser;
  //   } catch (error) {
  //     console.error('Error generating task report:', error.message);
  //     throw new Error('Unable to generate report');
  //   }
  // }

  async report(@Query() query: any) {
    const { startDate, endDate, id } = query;

    if (!id) {
      return [];
    }

    try {
      const department = await this.findOne({
        where: { id },
        relations: ['department.task'],
      });

      if (!department) {
        throw new Error('Department not found');
      }

      // const users = department.department.map((user) => {
      //   // const userTasks = user.task
      //     .map((task) => {
      //       const processDate = moment(task?.processDate).add(task?.dealine, 'days').format('YYYY-MM-DD').toString();

      //       const includeTask = (!startDate && !endDate) || (startDate && endDate && moment(processDate).isBetween(startDate, endDate, undefined, '[]'));

      //       if (includeTask) {
      //         const updateDate = moment(task?.updated_at).format('YYYY-MM-DD').toString();
      //         const currentDate = moment(new Date()).format('YYYY-MM-DD').toString();
      //         let status;

      //         if (updateDate > processDate && task.workstatus === 'COMPLETED') {
      //           status = 'Quá hạn';
      //         } else if (currentDate > processDate && (task.workstatus === 'NOPROCESS' || task.workstatus === 'PROCESSING')) {
      //           status = 'Quá hạn';
      //         } else if (processDate >= currentDate && task.workstatus === 'COMPLETED') {
      //           status = 'Đúng hạn';
      //         } else {
      //           status = 'Bình thường';
      //         }

      //         return {
      //           taskId: task.id,
      //           taskName: task.taskname,
      //           completionDate: processDate,
      //           status: status,
      //           userName: user.name,
      //           departmentName: department.name,
      //         };
      //       }

      //       return null;
      //     })
      //     .filter(Boolean); // Filter out null values

      //   return {
      //     userName: user.name,
      //     departmentName: department.name,
      //     // tasks: userTasks, // Could be an empty array if no tasks match the filters
      //   };
      // });

      // return users;
      return {};
    } catch (error) {
      console.error('Error generating task report:', error.message);
      throw new Error('Unable to generate report');
    }
  }
  
  async update(department: DepartmentUDDto, id: number) {
    try {
      const result = await this.departmentRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.departmentRepository.save({ ...result, ...department });
    } catch (error) {
      console.log(error);
    }
  }


  // Delete department and it constrain  
  async delete_department(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    // Start a transaction
    await queryRunner.startTransaction();

    try {
      // Disable foreign key checks
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

      // Perform the delete operation
      await queryRunner.query('DELETE FROM department WHERE id = ?;', [id]);

      // Re-enable foreign key checks
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

      // Commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback the transaction if something goes wrong
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
  

}
