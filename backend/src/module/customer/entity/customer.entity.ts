import { Status } from '@config/enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '@module/company/entity/company.entity';
import { Branch } from '@module/branch/entity/branch.entity';
import { Inquiry } from '@module/inquiry/entity/inquiry.entity';
import { Contract } from '@module/contract/entity/contract.entity';
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

  @Column({ type: 'int', nullable: true })
  company_id: number;

  @Column({ type: 'int', nullable: true })
  branch_id: number;

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

  @ManyToOne(() => Branch, (branch) => branch.user)
  @JoinColumn({ name: 'branch_id', referencedColumnName: 'id' })
  branch?: Branch;

  @OneToMany(() => NoteHistoryInquiry, (noteHistory) => noteHistory.customer, { cascade: true })
  noteHistory?: NoteHistoryInquiry[];

  @OneToMany(() => Inquiry, (inquiry) => inquiry.customer, { cascade: true })
  inquiry?: Inquiry[];

  @OneToMany(() => Envent, (envent) => envent.customer, { cascade: true })
  envent?: Envent[];

  @OneToMany(() => Contract, (contract) => contract.customer, { cascade: true })
  contract?: Contract[];

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

  @ManyToOne(() => Company, (company) => company.user)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company?: Company;
}
