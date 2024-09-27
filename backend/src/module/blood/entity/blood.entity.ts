import { Status } from '@config/enum';
import { BloodDetail } from '@module/blood_detail/entity/blood_detail.entity';
import { Hospital } from '@module/hospital/entity/hospital.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Blood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  transactionCodes: string;

  @Column({ type: 'int' })
  bloodtype: number;

  @OneToMany(() => BloodDetail, (bloodDetail) => bloodDetail.blood, { cascade: true })
  bloodDetail?: BloodDetail[];

  @Column({ type: 'varchar' })
  transactionDate: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'int', nullable: true })
  hospital_id: number;

  @ManyToOne(() => Hospital, (hospital) => hospital.blood)
  @JoinColumn({ name: 'hospital_id', referencedColumnName: 'id' })
  hospital?: Hospital;

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
