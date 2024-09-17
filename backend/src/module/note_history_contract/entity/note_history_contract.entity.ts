import { Contract } from '@module/contract/entity/contract.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NoteHistoryContract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  contract_id: number;

  @Column({ type: 'text', nullable: true })
  processingStatus?: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToOne(() => Contract, (contract) => contract.note_history_contract)
  @JoinColumn({ name: 'contract_id', referencedColumnName: 'id' })
  contract?: Contract;
}
