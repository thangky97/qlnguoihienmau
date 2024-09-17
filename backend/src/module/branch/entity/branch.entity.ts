import { Status } from '@config/enum';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '@module/company/entity/company.entity';
import { User } from '@module/user/entity/user.entity';

@Entity()
export class Branch {
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

  @Column({ type: 'int', nullable: true })
  company_id: number;

  @ManyToOne(() => Company, (company) => company.branch)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company?: Company;

  @OneToMany(() => User, (user) => user.branch, { cascade: true })
  user?: User[];

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
