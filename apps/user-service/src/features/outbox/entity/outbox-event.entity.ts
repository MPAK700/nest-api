import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { OutboxEventStatus } from '../enum/outbox-event-status.enum.ts';
import type { BalanceTransferCompletedEventDto } from '../../../../../../libs/contracts/src/events/balance-transfer-completed.event.ts';

@Entity()
export class OutboxEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventType: string;

  @Column({ type: 'json' })
  payload: Omit<BalanceTransferCompletedEventDto, 'eventId'>;

  @Column({
    type: 'enum',
    enum: OutboxEventStatus,
    default: OutboxEventStatus.PENDING,
  })
  status: OutboxEventStatus;

  @CreateDateColumn()
  createdAt: Date;
}
