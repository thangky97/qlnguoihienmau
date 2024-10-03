import { WorkStatus, StatusContract, ProcessingStatus } from '@config/enum';

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
