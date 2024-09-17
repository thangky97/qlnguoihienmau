import { Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@module/user/entity/user.entity';
import { Branch } from '@module/branch/entity/branch.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  contactmobile: string;

  @Column({ type: 'varchar' })
  phonezalo: string;

  @Column({ type: 'varchar' })
  linkfb: string;

  @Column({ type: 'varchar' })
  contactemail: string;

  @Column({ type: 'varchar' })
  langname: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status?: Status;

  @OneToMany(() => User, (user) => user.company, { cascade: true })
  user?: User[];

  @OneToMany(() => User, (company) => company.company_referral, { cascade: true })
  company_referral?: User[];

  @OneToMany(() => Branch, (branch) => branch.company, { cascade: true })
  branch?: Branch[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
