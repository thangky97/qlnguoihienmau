import { Status } from '@config/enum';
import { Customer } from '@module/customer/entity/customer.entity';
import { Envent } from '@module/envent/entity/envent.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RegisterDonateBlood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  customer_id: number;

  @Column({ type: 'int', nullable: true })
  envent_id?: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToOne(() => Customer, (customer) => customer.register_donate_blood)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer?: Customer;

  @ManyToOne(() => Envent, (envent) => envent.register_donate_blood)
  @JoinColumn({ name: 'envent_id', referencedColumnName: 'id' })
  envent?: Envent;

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
