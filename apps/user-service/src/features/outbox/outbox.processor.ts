import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { OutboxEvent } from './entity/outbox-event.entity.ts';
import { OutboxEventStatus } from './enum/outbox-event-status.enum.ts';

export const OUTBOX_KAFKA_SERVICE = 'OUTBOX_KAFKA_SERVICE';
const OUTBOX_BATCH_SIZE = 100;

@Injectable()
export class OutboxProcessor implements OnModuleInit {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepository: Repository<OutboxEvent>,
    @Inject(OUTBOX_KAFKA_SERVICE)
    private readonly clientKafka: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.clientKafka.connect();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processOutboxMessages(): Promise<void> {
    const events = await this.claimPendingEvents();

    if (events.length === 0) {
      return;
    }

    this.logger.log(`Processing ${events.length} outbox events`);

    for (const event of events) {
      try {
        await lastValueFrom(
          this.clientKafka.emit(event.eventType, {
            eventId: event.id,
            ...event.payload,
          }),
        );

        await this.outboxRepository.update(event.id, {
          status: OutboxEventStatus.PROCESSED,
        });
        this.logger.debug(`Published outbox event id=${event.id}`);
      } catch (error) {
        await this.outboxRepository.update(event.id, {
          status: OutboxEventStatus.PENDING,
        });

        const errorMessage =
          error instanceof Error
            ? (error.stack ?? error.message)
            : String(error);
        this.logger.error(
          `Failed to publish outbox event id=${event.id}`,
          errorMessage,
        );
      }
    }
  }

  @Transactional()
  private async claimPendingEvents(): Promise<OutboxEvent[]> {
    const events = await this.outboxRepository
      .createQueryBuilder('outbox')
      .setLock('pessimistic_write')
      .setOnLocked('skip_locked')
      .where('outbox.status = :status', {
        status: OutboxEventStatus.PENDING,
      })
      .orderBy('outbox.createdAt', 'ASC')
      .take(OUTBOX_BATCH_SIZE)
      .getMany();

    if (events.length === 0) {
      return [];
    }

    const eventIds = events.map((event) => event.id);

    await this.outboxRepository
      .createQueryBuilder()
      .update(OutboxEvent)
      .set({ status: OutboxEventStatus.PROCESSING })
      .whereInIds(eventIds)
      .execute();

    return events.map((event) => ({
      ...event,
      status: OutboxEventStatus.PROCESSING,
    }));
  }
}
