import { Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Jobfield } from '@module/jobfield/entity/jobfield.entity';
import { Department } from '@module/department/entity/department.entity';

@Entity()
export class Workingprocesstemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', nullable: true })
  jobfield_id: number;
  @Column({ type: 'int', nullable: true })
  department_id: number;

  @Column({ type: 'int', nullable: true })
  prev_task_id: number;

  @Column({ type: 'int' })
  sequence: number;

  @Column({ type: 'float' })
  limitdays: number;

  @ManyToOne(() => Jobfield, (jobfield) => jobfield.workingprocesstemplate)
  @JoinColumn({ name: 'jobfield_id', referencedColumnName: 'id' })
  jobfield?: Jobfield;

  @ManyToOne(() => Department, (department) => department.workingprocesstemplate)
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  departmentld?: Department;

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
