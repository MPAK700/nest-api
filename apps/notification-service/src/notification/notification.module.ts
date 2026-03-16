import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway.ts';

@Module({
  providers: [NotificationGateway],
})
export class NotificationModule {}
