import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway.ts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { StringValue } from 'ms';
import { SocketAuthService } from './services/socket-auth.service.ts';
import { NotificationController } from './controllers/notification.controller.ts';
import { NotificationEventsController } from './controllers/notification-events.controller.ts';
import { NotificationService } from './services/notification.service.ts';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema.ts';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<StringValue>(
            'JWT_ACCESS_EXPIRES_IN',
          ),
        },
      }),
    }),
  ],
  controllers: [NotificationController, NotificationEventsController],
  providers: [NotificationGateway, SocketAuthService, NotificationService],
})
export class NotificationModule {}
