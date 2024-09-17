import { Status, WorkStatus, StatusContract, ProcessingStatus } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Jobfield } from '@module/jobfield/entity/jobfield.entity';
import { Customer } from '@module/customer/entity/customer.entity';
import { IsString } from 'class-validator';
import { Inquiry } from '@module/inquiry/entity/inquiry.entity';
import { User } from '@module/user/entity/user.entity';
import { Job } from '@module/job/entity/job.entity';
import { NoteHistoryContract } from '@module/note_history_contract/entity/note_history_contract.entity';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  customer_code: string;

  @Column({ type: 'varchar' })
  contract_number_information: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', nullable: true })
  jobfield_id: number;

  @Column({ type: 'int', nullable: true })
  inquiry_id: number;

  @Column({ type: 'date' })
  createDate: Date;

  @Column({ type: 'date', nullable: true })
  signing_date: Date;

  @Column({ type: 'varchar' })
  user_code: string;

  @Column({ type: 'varchar' })
  duration: string;

  @Column({ type: 'text' })
  note: string;

  @Column({
    type: 'enum',
    enum: WorkStatus,
  })
  workstatus?: WorkStatus;

  @ManyToOne(() => Customer, (customer) => customer.contract)
  @JoinColumn({ name: 'customer_code', referencedColumnName: 'code' })
  customer?: Customer;

  @ManyToOne(() => User, (user) => user.contractUser)
  @JoinColumn({ name: 'user_code', referencedColumnName: 'code' })
  contractUser?: User;

  @ManyToOne(() => Jobfield, (jobfield) => jobfield.contract)
  @JoinColumn({ name: 'jobfield_id', referencedColumnName: 'id' })
  jobfield?: Jobfield;

  @ManyToOne(() => Inquiry, (inquiry) => inquiry.contract)
  @JoinColumn({ name: 'inquiry_id', referencedColumnName: 'id' })
  inquiry?: Inquiry;

  @OneToMany(() => Job, (job) => job.contract, { cascade: true })
  contract?: Job[];

  @OneToMany(() => NoteHistoryContract, (note_history_contract) => note_history_contract.contract, { cascade: true })
  note_history_contract?: NoteHistoryContract[];

  @Column({
    type: 'enum',
    enum: ProcessingStatus,
    default: ProcessingStatus.CONTACT,
  })
  processingStatus?: ProcessingStatus;

  @Column({
    type: 'enum',
    enum: StatusContract,
    default: StatusContract.NEW,
  })
  status?: StatusContract;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  // Make the file_contract column nullable
  @Column({ type: 'text', nullable: true })
  file_contract: string;
}
