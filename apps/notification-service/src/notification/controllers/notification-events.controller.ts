import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BALANCE_TRANSFER_COMPLETED_EVENT } from '../../../../../libs/contracts/src/events/balance-transfer-completed.event.ts';
import type { BalanceTransferCompletedEventDto } from '../../../../../libs/contracts/src/events/balance-transfer-completed.event.ts';
import { NotificationService } from '../services/notification.service.ts';

@Controller()
export class NotificationEventsController {
  private readonly logger = new Logger(NotificationEventsController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(BALANCE_TRANSFER_COMPLETED_EVENT)
  async handleBalanceTransferCompleted(
    @Payload() event: BalanceTransferCompletedEventDto,
  ) {
    this.logger.log(
      `Received ${BALANCE_TRANSFER_COMPLETED_EVENT} eventId=${event.eventId} senderId=${event.senderId}`,
    );

    await this.notificationService.handleTransferCompleted(event);
  }
}
