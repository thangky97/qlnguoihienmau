import { Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '@module/company/entity/company.entity';
import { User } from '@module/user/entity/user.entity';
import { Workingprocesstemplate } from '@module/workingprocesstemplate/entity/workingprocesstemplate.entity';
import { Task } from '@module/task/entity/task.entity';

@Entity()
export class Department {
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

  @OneToMany(() => Workingprocesstemplate, (workingprocesstemplate) => workingprocesstemplate.departmentld, { cascade: true })
  workingprocesstemplate?: Workingprocesstemplate[] | null;

  @OneToMany(() => Task, (task) => task.department, { cascade: true })
  task?: Task[] | null;

  @OneToMany(() => User, (user) => user.department, { cascade: true })
  department?: User[];

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
