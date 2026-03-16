import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module.ts';

@Module({
  imports: [NotificationModule],
})
export class NotificationServiceModule {}
