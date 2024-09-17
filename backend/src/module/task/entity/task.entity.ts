import { Status, WorkStatusTask } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Jobfield } from '@module/jobfield/entity/jobfield.entity';
import { User } from '@module/user/entity/user.entity';
import { Job } from '@module/job/entity/job.entity';
import { Department } from '@module/department/entity/department.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  job_id: number;

  @Column({ type: 'int', nullable: true })
  jobfield_id: number;

  @Column({ type: 'int', nullable: true })
  department_id: number;

  @Column({ type: 'varchar' })
  taskname: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  dealine: number;

  @Column({ type: 'date' })
  processDate: Date;

  @Column({ type: 'date' })
  createDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'int', nullable: true })
  sequence: number;

  @Column({ type: 'varchar', nullable: true })
  note: string;

  @ManyToOne(() => Jobfield, (jobfield) => jobfield.task)
  @JoinColumn({ name: 'jobfield_id', referencedColumnName: 'id' })
  jobfield?: Jobfield;

  @ManyToOne(() => Department, (department) => department.task)
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  department?: Department;

  @ManyToOne(() => Job, (job) => job.task)
  @JoinColumn({ name: 'job_id', referencedColumnName: 'id' })
  job?: Job;

  @Column({
    type: 'enum',
    enum: WorkStatusTask,
  })
  workstatus?: WorkStatusTask;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status?: Status;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column({ type: 'int', nullable: true })
  Workingprocesstemplate_id: number;

  @Column({ type: 'int', nullable: true })
  prev_Workingprocesstemplate_id: number;
  
}
