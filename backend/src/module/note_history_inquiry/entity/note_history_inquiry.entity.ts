import { ProcessingStatus } from '@config/enum';

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from '@module/customer/entity/customer.entity';

@Entity()
export class NoteHistoryInquiry {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => Customer, (customer) => customer.noteHistory)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer?: Customer;
}
