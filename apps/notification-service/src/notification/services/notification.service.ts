import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { NotificationGateway } from '../notification.gateway.ts';
import { BALANCE_TRANSFER_COMPLETED_EVENT } from '../../../../../libs/contracts/src/events/balance-transfer-completed.event.ts';
import type { BalanceTransferCompletedEventDto } from '../../../../../libs/contracts/src/events/balance-transfer-completed.event.ts';
import {
  Notification,
  type NotificationDocument,
} from '../schemas/notification.schema.ts';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async handleTransferCompleted(event: BalanceTransferCompletedEventDto) {
    await this.notificationModel.create({
      userId: event.senderId,
      type: BALANCE_TRANSFER_COMPLETED_EVENT,
      eventId: event.eventId,
      payload: event,
    });

    this.logger.log(
      `Saved notification eventId=${event.eventId} for userId=${event.senderId}`,
    );

    this.notificationGateway.sendTransferCompletedNotification(event);
  }
}
