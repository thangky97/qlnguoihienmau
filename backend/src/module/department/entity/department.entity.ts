import { Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

  @OneToMany(() => Workingprocesstemplate, (workingprocesstemplate) => workingprocesstemplate.departmentld, { cascade: true })
  workingprocesstemplate?: Workingprocesstemplate[] | null;

  @OneToMany(() => Task, (task) => task.department, { cascade: true })
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
