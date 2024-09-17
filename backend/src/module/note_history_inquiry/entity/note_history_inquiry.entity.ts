import { ProcessingStatus } from '@config/enum';

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Inquiry } from '@module/inquiry/entity/inquiry.entity';
import { Customer } from '@module/customer/entity/customer.entity';

@Entity()
export class NoteHistoryInquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  inquiry_id: number;

  @Column({ type: 'text', nullable: true })
  processingStatus?: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'date', nullable: true })
  thoigianhienmau: Date;

  @Column({ type: 'varchar', nullable: true })
  solanhien: string;

  @Column({ type: 'varchar', nullable: true })
  luongmauhien: string;

  @Column({ type: 'int', nullable: true })
  customer_id: number;

  // @ManyToOne(() => Inquiry, (inquiry) => inquiry.note_history_inquiry)
  // @JoinColumn({ name: 'inquiry_id', referencedColumnName: 'id' })
  // inquiry?: Inquiry;

  @ManyToOne(() => Customer, (customer) => customer.noteHistory)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer?: Customer;
}
