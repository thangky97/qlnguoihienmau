import { WorkStatusTask, StatusContract, WorkStatus } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Jobfield } from '@module/jobfield/entity/jobfield.entity';
import { Task } from '@module/task/entity/task.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  code: string;

  @Column({ type: 'int', nullable: true })
  contract_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', nullable: true })
  jobfield_id: number;

  @Column({ type: 'date' })
  jobDate: Date;

  @Column({ type: 'date' })
  createDate: Date;

  @Column({ type: 'varchar' })
  user_code: string;

  @ManyToOne(() => Jobfield, (jobfield) => jobfield.jobfield)
  @JoinColumn({ name: 'jobfield_id', referencedColumnName: 'id' })
  jobfield?: Jobfield;

  @OneToMany(() => Task, (task) => task.job, { cascade: true })
  task?: Task[];

  @Column({
    type: 'enum',
    enum: StatusContract,
  })
  status?: StatusContract;

  @Column({
    type: 'enum',
    enum: WorkStatus,
    nullable: true,
  })
  workstatus?: WorkStatus;

  @Column({
    type: 'enum',
    enum: WorkStatusTask,
  })
  workstatusJob?: WorkStatusTask;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
