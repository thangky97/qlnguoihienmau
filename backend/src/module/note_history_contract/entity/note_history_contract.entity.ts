import { Contract } from '@module/contract/entity/contract.entity';
import { Envent } from '@module/envent/entity/envent.entity';
import { User } from '@module/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NoteHistoryContract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'int', nullable: true })
  envent_id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @ManyToOne(() => Envent, (envent) => envent.noteHistory)
  @JoinColumn({ name: 'envent_id', referencedColumnName: 'id' })
  envent?: Envent;

  @ManyToOne(() => User, (user) => user.noteHistory)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;
}
