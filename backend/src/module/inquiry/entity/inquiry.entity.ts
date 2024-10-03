import { Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Jobfield } from '@module/jobfield/entity/jobfield.entity';

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

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  inquiry_date: Date;

  @ManyToOne(() => Jobfield, (jobfield) => jobfield.inquiry)
  @JoinColumn({ name: 'jobfield_id', referencedColumnName: 'id' })
  jobfield?: Jobfield;

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
