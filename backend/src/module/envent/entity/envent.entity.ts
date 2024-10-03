import { Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@module/user/entity/user.entity';
import { NoteHistoryContract } from '@module/note_history_contract/entity/note_history_contract.entity';
import { Customer } from '@module/customer/entity/customer.entity';
import { RegisterDonateBlood } from '@module/register_donate_blood/entity/register_donate_blood.entity';
import { CategoryPost } from '@module/category_post/entity/category_post.entity';

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

  // @Column({ type: 'varchar', nullable: true })
  // user_id: string;

  // @ManyToOne(() => User, (user) => user.envent)
  // @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  // user?: User;

  @Column({ type: 'int', nullable: true })
  category_post_id: number;

  @Column({ type: 'int', nullable: true })
  customer_id: number;

  @ManyToOne(() => Customer, (customer) => customer.envent)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer?: Customer;

  @ManyToOne(() => CategoryPost, (categoryPost) => categoryPost.envent)
  @JoinColumn({ name: 'category_post_id', referencedColumnName: 'id' })
  categoryPost?: Customer;

  @OneToMany(() => NoteHistoryContract, (noteHistory) => noteHistory.envent, { cascade: true })
  noteHistory?: NoteHistoryContract[];

  @OneToMany(() => RegisterDonateBlood, (register_donate_blood) => register_donate_blood.envent, { cascade: true })
  register_donate_blood?: RegisterDonateBlood[];

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
