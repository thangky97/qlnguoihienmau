import { Gender, Role, Status, Verify } from '@config/enum';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Authority } from './authority.entity';
import { Company } from '@module/company/entity/company.entity';
import { Branch } from '@module/branch/entity/branch.entity';
import { Department } from '@module/department/entity/department.entity';
import { Contract } from '@module/contract/entity/contract.entity';
import { Job } from '@module/job/entity/job.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  company_tax_code: string;

  @Column({ type: 'int', nullable: true })
  company_id: number;

  @Column({ type: 'int', nullable: true })
  referral_source_id: number;

  @ManyToOne(() => Company, (company) => company.company_referral)
  @JoinColumn({ name: 'referral_source_id', referencedColumnName: 'id' })
  company_referral?: Company;

  @Column({ type: 'int', nullable: true })
  branch_id: number;

  @ManyToOne(() => Branch, (branch) => branch.user)
  @JoinColumn({ name: 'branch_id', referencedColumnName: 'id' })
  branch?: Branch;

  @Column({ type: 'int', nullable: true })
  department_id: number;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender?: Gender;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STAFF,
  })
  role?: Role;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status?: Status;

  @Column({
    type: 'enum',
    enum: Verify,
    default: Verify.VERIFIED,
  })
  verify?: Verify;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @OneToMany(() => Authority, (authority) => authority.user, { cascade: ['update', 'insert', 'remove'] })
  authorities?: Authority[];

  @ManyToOne(() => Company, (company) => company.user)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company?: Company;

  @ManyToOne(() => Department, (department) => department.department)
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  department?: Department;

  @OneToMany(() => Contract, (contract) => contract.contractUser, { cascade: true })
  contractUser?: Contract[];

  @OneToMany(() => Job, (job) => job.userJob, { cascade: true })
  userJob?: Job[];

  @Column({ type: 'varchar', nullable: true })
  expand_1: string;
  @Column({ type: 'varchar', nullable: true })
  expand_2: string;
  @Column({ type: 'varchar', nullable: true })
  expand_3: string;
}
