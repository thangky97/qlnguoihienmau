import { Role, Status } from '@config/enum';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Authority } from './authority.entity';
import { Envent } from '@module/envent/entity/envent.entity';
import { NoteHistoryContract } from '@module/note_history_contract/entity/note_history_contract.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STAFF,
  })
  role?: Role;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

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

  @OneToMany(() => Authority, (authority) => authority.user, { cascade: ['update', 'insert', 'remove'] })
  authorities?: Authority[];

  // @OneToMany(() => Envent, (envent) => envent.user, { cascade: true })
  // envent?: Envent[];

  @OneToMany(() => NoteHistoryContract, (noteHistory) => noteHistory.user, { cascade: true })
  noteHistory?: NoteHistoryContract[];
}
