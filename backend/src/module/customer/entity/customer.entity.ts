import { Status } from '@config/enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { NoteHistoryInquiry } from '@module/note_history_inquiry/entity/note_history_inquiry.entity';
import { Envent } from '@module/envent/entity/envent.entity';
import { RegisterDonateBlood } from '@module/register_donate_blood/entity/register_donate_blood.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  tax_code: string;

  @Column({ type: 'varchar', nullable: true })
  loaiHinh: string;

  @Column({ type: 'date' })
  date_birthday: Date;

  @Column({ type: 'varchar' })
  weight: string;

  @Column({ type: 'varchar' })
  height: string;

  @Column({ type: 'varchar', nullable: true })
  nhommau: string;

  @Column({ type: 'varchar', nullable: true })
  huyetap: string;

  @Column({ type: 'varchar', nullable: true })
  hemoglobin: string;

  @Column({ type: 'varchar', nullable: true })
  tinhtrangbenhly: string;

  @Column({ type: 'varchar', nullable: true })
  tieususdthuoc: string;

  @Column({ type: 'varchar', nullable: true })
  duchitieuhien: string;

  @Column({ type: 'varchar', nullable: true })
  luongmauhien: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @OneToMany(() => NoteHistoryInquiry, (noteHistory) => noteHistory.customer, { cascade: true })
  noteHistory?: NoteHistoryInquiry[];

  @OneToMany(() => Envent, (envent) => envent.customer, { cascade: true })
  envent?: Envent[];

  @OneToMany(() => RegisterDonateBlood, (register_donate_blood) => register_donate_blood.customer, { cascade: true })
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
