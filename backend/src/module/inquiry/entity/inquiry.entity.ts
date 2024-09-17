import { inquiryProcessingStatus, ProcessingStatus, Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '@module/company/entity/company.entity';
import { Jobfield } from '@module/jobfield/entity/jobfield.entity';
import { Customer } from '@module/customer/entity/customer.entity';
import { Contract } from '@module/contract/entity/contract.entity';
import { NoteHistoryInquiry } from '@module/note_history_inquiry/entity/note_history_inquiry.entity';

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  customer_code: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  note: string;

  @Column({ type: 'int', nullable: true })
  jobfield_id: number;

  @Column({ type: 'int', nullable: true })
  company_id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  inquiry_date: Date;

  @ManyToOne(() => Company, (company) => company.branch)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company?: Company;

  @ManyToOne(() => Customer, (customer) => customer.inquiry, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_code', referencedColumnName: 'code' })
  customer?: Customer;

  @ManyToOne(() => Jobfield, (jobfield) => jobfield.inquiry)
  @JoinColumn({ name: 'jobfield_id', referencedColumnName: 'id' })
  jobfield?: Jobfield;

  @OneToMany(() => Contract, (contract) => contract.inquiry, { cascade: true })
  contract?: Contract[];

  // @OneToMany(() => NoteHistoryInquiry, (note_history_inquiry) => note_history_inquiry.inquiry, { cascade: true })
  // note_history_inquiry?: NoteHistoryInquiry[];

  // @Column({
  //   type: 'enum',
  //   enum: ProcessingStatus,
  //   default: ProcessingStatus.CONTACT,
  // })
  @Column({ type: 'varchar', nullable: true })
  processingStatus?: string;

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
