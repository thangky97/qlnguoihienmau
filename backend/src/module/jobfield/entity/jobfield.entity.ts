import { Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '@module/company/entity/company.entity';
import { Workingprocesstemplate } from '@module/workingprocesstemplate/entity/workingprocesstemplate.entity';
import { Contract } from '@module/contract/entity/contract.entity';
import { Job } from '@module/job/entity/job.entity';
import { Task } from '@module/task/entity/task.entity';
import { Inquiry } from '@module/inquiry/entity/inquiry.entity';

@Entity()
export class Jobfield {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', nullable: true })
  company_id: number;

  @ManyToOne(() => Company, (company) => company.branch)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company?: Company;

  @OneToMany(() => Workingprocesstemplate, (workingprocesstemplate) => workingprocesstemplate.jobfield, { cascade: true })
  workingprocesstemplate?: Workingprocesstemplate[] | null;

  @OneToMany(() => Inquiry, (Inquirys) => Inquirys.jobfield, { cascade: true })
  inquiry?: Inquiry[] | null;

  @OneToMany(() => Contract, (contract) => contract.jobfield, { cascade: true })
  contract?: Contract[] | null;

  @OneToMany(() => Job, (job) => job.jobfield, { cascade: true })
  jobfield?: Job[] | null;

  @OneToMany(() => Task, (task) => task.jobfield, { cascade: true })
  task?: Task[] | null;

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
}
