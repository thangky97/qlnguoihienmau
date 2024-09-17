import { Management } from '@config/enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Authority {
  @PrimaryColumn({ unique: true, type: 'varchar', generated: 'uuid' })
  code: string;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'varchar', nullable: true })
  user_code: string;

  @Column({ type: 'enum', enum: Management })
  management: string;

  @ManyToOne(() => User, (user) => user.authorities)
  @JoinColumn({ name: 'user_code', referencedColumnName: 'code' })
  user?: User;

  @Column({ type: 'varchar', nullable: true })
  expand_1: string;
  @Column({ type: 'varchar', nullable: true })
  expand_2: string;
  @Column({ type: 'varchar', nullable: true })
  expand_3: string;
}
