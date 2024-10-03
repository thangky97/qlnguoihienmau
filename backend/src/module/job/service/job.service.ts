import { CommonService } from '@module/common/common.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '@module/job/entity/job.entity';
import { JobDto } from '@module/job/dto/job.dto';

import { FindOneOptions, Like, Raw, Repository } from 'typeorm';
import { JobFilterDto } from '@module/job/dto/job.filter.dto';
import { JobUDDto } from '@module/job/dto/jobUD.dto';
import { StatusContract, WorkStatus, WorkStatusTask } from '@config/enum';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Task } from '@module/task/entity/task.entity';
import { Workingprocesstemplate } from '@module/workingprocesstemplate/entity/workingprocesstemplate.entity';
import { Jobfield } from '@module/jobfield/entity/jobfield.entity';
import { MailService } from '@module/mail/mail.service';
import { User } from '@module/user/entity/user.entity';
import { TaskDto } from '@module/task/dto/task.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    private readonly commonService: CommonService,
    private readonly mailService: MailService,
    @InjectRepository(Workingprocesstemplate) private readonly workingprocesstemplateRepository: Repository<Workingprocesstemplate>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(Jobfield) private readonly JobfieldRepository: Repository<Jobfield>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  makeObjectQuery(startDate: Date, endDate: Date) {
    if (startDate && endDate) {
      return Raw((alias) => `${alias} >= :startDate and  ${alias} <= :endDate`, { startDate, endDate });
    } else if (startDate) {
      return Raw((alias) => `${alias} >= :startDate`, { startDate });
    } else if (endDate) {
      return Raw((alias) => `${alias} <= :endDate`, { endDate });
    }
  }
  async findOne(query: FindOneOptions): Promise<Job> {
    return await this.jobRepository.findOne(query);
  }

  // async create(job: JobDto) {
  //   try {
  //     const PREFIX_ID_JOB = 'CV';
  //     const currentYear = new Date().getFullYear().toString().slice(-2);
  //     const currentMonth = ('0' + (new Date().getMonth() + 1)).slice(-2);
  //     const format_code = '0000';
  //     let generateId = PREFIX_ID_JOB + currentYear + currentMonth + '0001';

  //     const filter_job = await this.jobRepository.find({
  //       where: {
  //         code: Like(`${PREFIX_ID_JOB}${currentYear}${currentMonth}%`),
  //       },
  //     });

  //     if (filter_job.length > 0) {
  //       const last_index = Number(filter_job[filter_job.length - 1].code.replace(`${PREFIX_ID_JOB}${currentYear}${currentMonth}`, '')) + 1;
  //       generateId = PREFIX_ID_JOB + currentYear + currentMonth + format_code.substring(0, 4 - last_index.toString().length) + last_index;
  //     }

  //     const check_code = await this.jobRepository.findOne({ where: { code: generateId } });
  //     if (check_code) {
  //       throw new BadRequestException('CODE_EXISTS');
  //     }

  //     const newJob = await this.jobRepository.save({ ...job, code: generateId });

  //     const workingProcessTemplate = await this.workingprocesstemplateRepository.findOne({ where: { jobfield_id: newJob.jobfield_id } });
  //     if (!workingProcessTemplate) {
  //       throw new NotFoundException('WORKING_PROCESS_TEMPLATE_NOT_FOUND');
  //     }

  //     if (newJob) {
  //       const jobFiled = await this.JobfieldRepository.findOne({
  //         where: { id: newJob.jobfield_id },
  //       });

  //       if (jobFiled) {
  //         const tasksPromises = jobFiled.workingprocesstemplate.map(async (value) => {
  //           const newTask = await this.taskRepository.save({
  //             job_id: newJob.id,
  //             jobfield_id: newJob.jobfield_id,
  //             taskname: value?.name,
  //             description: newJob.description,
  //             note: '',
  //             dealine: value?.limitdays,
  //             sequence: value?.sequence,
  //             processDate: newJob.jobDate,
  //             workstatus: WorkStatusTask.NOPROCESS,
  //             createDate: newJob.jobDate,
  //             endDate: '',
  //             department_id: value?.department_id,
  //           });
  //         });

  //         await Promise.all(tasksPromises);

  //         return jobFiled?.workingprocesstemplate;
  //       }
  //     }
  //   } catch (error) {
  //     return error;
  //   }
  // }

  async create(job: JobDto) {
    try {
      const PREFIX_ID_JOB = 'CV';
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const currentMonth = ('0' + (new Date().getMonth() + 1)).slice(-2);
      const format_code = '0000';
      let generateId = PREFIX_ID_JOB + currentYear + currentMonth + '0001';

      const filter_job = await this.jobRepository.find({
        where: {
          code: Like(`${PREFIX_ID_JOB}${currentYear}${currentMonth}%`),
        },
      });

      if (filter_job.length > 0) {
        const last_index = Number(filter_job[filter_job.length - 1].code.replace(`${PREFIX_ID_JOB}${currentYear}${currentMonth}`, '')) + 1;
        generateId = PREFIX_ID_JOB + currentYear + currentMonth + format_code.substring(0, 4 - last_index.toString().length) + last_index;
      }

      const check_code = await this.jobRepository.findOne({ where: { code: generateId } });
      if (check_code) {
        throw new BadRequestException('CODE_EXISTS');
      }

      const newJob = await this.jobRepository.save({ ...job, code: generateId });

      if (newJob) {
        const jobField = await this.JobfieldRepository.findOne({
          where: { id: newJob.jobfield_id },
        });

        if (jobField) {
          // let lastEndDate: Date | null = null; // Track the largest endDate encountered
          // Sort templates by sequence and then by id to maintain order within sequence
          // const sortedTemplates = jobField.workingprocesstemplate.sort((a, b) => {
          //   if (a.sequence === b.sequence) {
          //     return a.id - b.id; // Maintain original order if needed
          //   }
          //   return a.sequence - b.sequence;
          // });
          // const tasksPromises = sortedTemplates.map(async (template) => {
          //   const jobDate = new Date(newJob.jobDate); // Ensure jobDate is a Date object

          //   // Determine the startDate for the task
          //   const startDate = lastEndDate
          //     ? new Date(lastEndDate.getTime() + 24 * 60 * 60 * 1000) // Ngày hôm sau của ngày kết thúc trước đó
          //     : new Date(jobDate.getTime()); // Ngày bắt đầu cho tác vụ đầu tiên

          //   const integerDays = Math.floor(template.limitdays);
          //   const decimalPart = template.limitdays % 1;
          //   const addExtraDay = decimalPart > 0.1;

          //   // Calculate endDate
          //   const endDate = new Date(startDate.getTime() + (integerDays + (addExtraDay ? 1 : 0)) * 24 * 60 * 60 * 1000);

          //   // Điều chỉnh ngày kết thúc nếu limitdays > 0
          //   if (template.limitdays > 0) {
          //     endDate.setDate(endDate.getDate() - 1);
          //   }

          //   // Update lastEndDate
          //   lastEndDate = endDate;

          //   // Save the new task
          //   await this.taskRepository.save({
          //     job_id: newJob.id,
          //     jobfield_id: newJob.jobfield_id,
          //     taskname: template.name,
          //     description: newJob.description,
          //     note: '',
          //     dealine: template.limitdays,
          //     sequence: template.sequence,
          //     workstatus: WorkStatusTask.NOPROCESS,
          //     createDate: newJob.jobDate, // Ensure correct date format
          //     processDate: newJob.jobDate, // Ensure correct date format
          //     endDate: endDate, // End date in correct format
          //     department_id: template.department_id,
          //   });
          // });
          // await Promise.all(tasksPromises);
          // return jobField.workingprocesstemplate;

          const workingProcessTemplates = jobField.workingprocesstemplate;
          const tasks: Task[] = await this.mapToTaskEntities(workingProcessTemplates);
          // update start date = job date
          const jobDate = newJob.jobDate; // Or assign a specific date if needed
          tasks.forEach((task) => {
            task.job_id = newJob.id;
            task.createDate = jobDate;
            task.processDate = jobDate;
          });

          const updatedTasks = await this.calculateTaskDates(tasks);
          const result = await this.taskRepository.save(updatedTasks);
          return result;
        }
      }
    } catch (error) {
      console.error('Error creating job and tasks:', error.message);
      return error;
    }
  }

  async mapToTaskEntities(workingProcessTemplates: Workingprocesstemplate[]): Promise<Task[]> {
    const tasks: Task[] = workingProcessTemplates.map((template) => {
      const task = new Task();
      task.job_id = 0;
      task.jobfield_id = template.jobfield_id;
      task.department_id = template.department_id;
      task.taskname = template.name; // Assuming 'name' is the task name
      task.description = ''; // You can set a description if available
      task.dealine = template.limitdays; // Assuming 'limitdays' corresponds to the deadline in days
      task.processDate = null; // Set this as needed
      task.createDate = new Date(); // Set this to the desired date
      task.endDate = null; // Set this if you have an end date
      task.sequence = template.sequence;
      task.note = ''; // Set a note if available
      task.workstatus = WorkStatusTask.NOPROCESS; // Or another default status
      task.status = template.status; // Assuming status corresponds to the Task status

      task.Workingprocesstemplate_id = template.id;
      task.prev_Workingprocesstemplate_id = template.prev_task_id;

      return task;
    });

    return tasks;
  }

  // async calculateTaskDates(tasks: Task[]): Promise<Task[]> {
  //   let lastEndDate: Date | null = null;
  //   let lastSequenceStartDate: Date | null = null;

  //   // Sort tasks by their sequence
  //   const sortedTasks = tasks.sort((a, b) => a.sequence - b.sequence);

  //   // Map through the sorted tasks and calculate start and end dates
  //   const updatedTasks = sortedTasks.map((task, index, sortedTasks) => {
  //     if (index === 0 || task.sequence !== sortedTasks[index - 1].sequence) {
  //       // For the first task in the sequence or a new sequence
  //       const startDate = lastEndDate
  //         ? new Date(lastEndDate.getTime() + 24 * 60 * 60 * 1000) // Next day after the last end date
  //         : new Date(task.processDate);

  //       lastSequenceStartDate = startDate; // Store this start date for the sequence
  //     }

  //     const deadlineDays = Math.floor(task.dealine); // Assuming 'dealine' is the correct field name
  //     const endDate = new Date(lastSequenceStartDate?.getTime() + deadlineDays * 24 * 60 * 60 * 1000);

  //     lastEndDate = endDate; // Update lastEndDate for the next task

  //     // Update the task with the new processDate and endDate
  //     return {
  //       ...task,
  //       processDate: lastSequenceStartDate, // Set processDate to start_date
  //       endDate: endDate, // Set endDate to end_date
  //       // start_date: lastSequenceStartDate?.toISOString().split('T')[0], // Format start_date as YYYY-MM-DD
  //       // end_date: endDate.toISOString().split('T')[0], // Format end_date as YYYY-MM-DD
  //     };
  //   });

  //   // If you need to save updated tasks back to the database, you can do that here.
  //   // Assuming you have a repository or service to handle the database operations
  //   // await this.taskRepository.save(updatedTasks);

  //   return updatedTasks;
  // }

  async calculateTaskDates(tasks: Task[]): Promise<Task[]> {
    const updatedTasks: Task[] = [];

    // Sort tasks by sequence to maintain order
    const sortedTasks = tasks.sort((a, b) => a.sequence - b.sequence);

    // Map to store task end dates by Workingprocesstemplate_id
    const endDateMap = new Map<number, Date>();

    // Loop through the sorted tasks and calculate processDate and endDate
    for (const task of sortedTasks) {
      let processDate: Date;

      if (task.prev_Workingprocesstemplate_id === 0) {
        // If it's the first task or no previous task
        processDate = new Date(task.createDate);
      } else {
        // Get the endDate of the previous task from the map
        const prevTaskEndDate = endDateMap.get(task.prev_Workingprocesstemplate_id);

        // Process date is the day after the previous task's end date
        if (prevTaskEndDate) {
          processDate = new Date(prevTaskEndDate.getTime() + 24 * 60 * 60 * 1000);
        } else {
          // Fallback if the prevTaskEndDate isn't found (shouldn't happen with correct data)
          processDate = new Date(task.createDate);
        }
      }

      // Calculate endDate based on the dealine field
      const deadlineDays = Math.ceil(task.dealine); // This ensures 0.5 becomes 1
      const endDate = new Date(processDate.getTime() + deadlineDays * 24 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000);

      // Store the endDate for the current task in the map
      endDateMap.set(task.Workingprocesstemplate_id, endDate);

      // Update the task with the new processDate and endDate
      updatedTasks.push({
        ...task,
        processDate: processDate,
        endDate: endDate,
      });
    }

    return updatedTasks;
  }

  async find(body: JobFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'job',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
          user_code: body?.filter?.user_code || undefined,
          jobfield_id: body?.filter?.jobfield_id || undefined,
          contract_id: body?.filter?.contract_id || undefined,
        },
      },
    });
  }

  async findAll(query) {
    const result = await this.jobRepository.find({
      where: {
        name: query.name && Like(`%${query.name}%`),
        jobfield_id: query.jobfield_id,
        contract_id: query.contract_id,
        user_code: query.user_code,
        status: query.status,
      },
      order: {
        id: 'DESC',
      },
    });

    const updatedResult = result.map((job) => {
      const maxdate = job.task.reduce((max: Date, task: Task) => {
        const taskDate = new Date(task.processDate);
        const dealineDays = task?.dealine;

        // Lấy phần nguyên và phần thập phân của dealineDays
        const integerDays = Math.floor(dealineDays);
        const decimalPart = dealineDays % 1;

        // Xác định nếu cần cộng thêm ngày
        const addExtraDay = decimalPart > 0.1;

        // Cộng thêm số ngày
        taskDate.setDate(taskDate.getDate() + integerDays + (addExtraDay ? 1 : 0));

        // Nếu dealine lớn hơn 0, trừ đi 1 ngày
        if (dealineDays > 0) {
          taskDate.setDate(taskDate.getDate() - 1);
        }

        // So sánh với ngày tối đa hiện tại
        return taskDate > max ? taskDate : max;
      }, new Date(0));

      const maxdateUpdate = job.task.reduce((max: Date, task: Task) => {
        const taskUpdatedDate = new Date(task.updated_at);
        return taskUpdatedDate > max ? taskUpdatedDate : max;
      }, new Date(0));

      return {
        ...job,
        maxdate: maxdate.toISOString(), // Chuyển đổi Date thành chuỗi ISO
        maxdateUpdate: maxdateUpdate.toISOString(), // Chuyển đổi Date thành chuỗi ISO
      };
    });

    return updatedResult;
  }
  async findCountJobByStatus(query) {
    const { startDate, endDate } = query;
    const useCustomDateRange = startDate || endDate;

    const currentStartDate = useCustomDateRange ? startDate : startOfMonth(new Date());
    const currentEndDate = useCustomDateRange ? endDate : endOfMonth(new Date());

    const countNewPromise = this.jobRepository.count({
      where: {
        status: StatusContract.NEW,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countCompletedPromise = this.jobRepository.count({
      where: {
        status: StatusContract.COMPLETED,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countInProcessPromise = this.jobRepository.count({
      where: {
        status: StatusContract.INPROCESS,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const [countNew, countCOMPLETED, countINPROCESS] = await Promise.all([countNewPromise, countCompletedPromise, countInProcessPromise]);

    // return [
    //   { name: 'new', value: countNew, fill: '#1f77b4' },
    //   { name: 'completed', value: countCOMPLETED, fill: '#ff7f0e' },
    //   { name: 'inprocess', value: countINPROCESS, fill: '#2ca02a' },
    // ];

    return {
      labels: ['Mới', 'Đang tiến hành', 'Hoàn thành'],
      datasets: [
        {
          label: '# of Votes',
          data: [countNew, countCOMPLETED, countINPROCESS],
          backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
          borderWidth: 1,
        },
      ],
    };
  }

  async findJobByStatus(query) {
    const { startDate, endDate } = query;
    const useCustomDateRange = startDate || endDate;

    const currentStartDate = useCustomDateRange ? startDate : startOfMonth(new Date());
    const currentEndDate = useCustomDateRange ? endDate : endOfMonth(new Date());

    const countNewPromise = this.jobRepository.find({
      where: {
        status: StatusContract.NEW,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countCompletedPromise = this.jobRepository.find({
      where: {
        status: StatusContract.COMPLETED,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const countInProcessPromise = this.jobRepository.find({
      where: {
        status: StatusContract.INPROCESS,
        createDate: this.makeObjectQuery(currentStartDate, currentEndDate),
      },
    });

    const [countNew, countCOMPLETED, countINPROCESS] = await Promise.all([countNewPromise, countCompletedPromise, countInProcessPromise]);

    return {
      countNew,
      countCOMPLETED,
      countINPROCESS,
    };
  }

  async getDetail(id: number) {
    try {
      const data = await this.findOne({ where: { id: id } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async update(job: JobUDDto, id: number) {
    try {
      const result = await this.jobRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.jobRepository.save({ ...result, ...job });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(query: any) {
    try {
      const taskToDelete = await this.taskRepository.find({
        where: {
          job_id: query.id,
        },
      });
      for (const task of taskToDelete) {
        await this.taskRepository.remove(task);
      }

      await this.jobRepository.delete({
        id: query?.id,
      });
      return 'ok';
    } catch (error) {
      console.log(error);
    }
  }
}
