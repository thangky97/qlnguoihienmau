import { Status } from '@config/enum';
import { Blood } from '@module/blood/entity/blood.entity';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class BloodDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  transactionCode: string;

  @ManyToOne(() => Blood, (blood) => blood.bloodDetail)
  @JoinColumn({ name: 'transactionCode', referencedColumnName: 'transactionCodes' })
  blood?: Blood;

  @Column({ type: 'varchar' })
  bloodName: string;

  @Column({ type: 'int' })
  qty: number;

  @Column({ type: 'int', nullable: true })
  hospital_id: number;

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
