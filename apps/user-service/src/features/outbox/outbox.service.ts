import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxEvent } from './entity/outbox-event.entity.ts';
import { OutboxEventStatus } from './enum/outbox-event-status.enum.ts';
import { BALANCE_TRANSFER_COMPLETED_EVENT } from '../../../../../libs/contracts/src/events/balance-transfer-completed.event.ts';
import type { BalanceTransferCompletedEventDto } from '../../../../../libs/contracts/src/events/balance-transfer-completed.event.ts';

@Injectable()
export class OutboxService {
  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepository: Repository<OutboxEvent>,
  ) {}

  async addBalanceTransferCompletedEvent(
    payload: Omit<BalanceTransferCompletedEventDto, 'eventId'>,
  ): Promise<OutboxEvent> {
    const event = this.outboxRepository.create({
      eventType: BALANCE_TRANSFER_COMPLETED_EVENT,
      payload,
      status: OutboxEventStatus.PENDING,
    });

    return await this.outboxRepository.save(event);
  }
}
