import { Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '@module/company/entity/company.entity';
import { User } from '@module/user/entity/user.entity';

@Entity()
export class Envent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'date' })
  event_date: Date;

  @Column({ type: 'varchar' })
  start_time: string;

  @Column({ type: 'varchar' })
  end_time: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar' })
  blood_count: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  blood_type: string;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @ManyToOne(() => User, (use) => use.envent)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

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
