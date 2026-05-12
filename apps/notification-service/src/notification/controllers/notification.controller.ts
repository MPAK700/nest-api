import { Controller, Param, Post } from '@nestjs/common';
import { NotificationGateway } from '../notification.gateway.ts';

@Controller('/notification')
export class NotificationController {
  constructor(private readonly notificationGateway: NotificationGateway) {}
  @Post(':userId')
  notification(@Param('userId') userId: string) {
    this.notificationGateway.sendNotification(userId);
  }
}
