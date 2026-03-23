import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketAuthService } from './services/socket-auth.service.ts';
import type { BalanceTransferCompletedEventDto } from '../../../../libs/contracts/src/events/balance-transfer-completed.event.ts';
import type {
  NotificationSocket,
  NotificationSocketData,
} from './types/notification-socket.type.ts';

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);
  @WebSocketServer()
  io: Server<
    Record<string, never>,
    Record<string, never>,
    Record<string, never>,
    NotificationSocketData
  >;

  constructor(private readonly socketAuthService: SocketAuthService) {}

  afterInit(server: Server) {
    this.logger.log(`Initialized ${server.getMaxListeners()}`);
  }
  handleConnection(client: NotificationSocket) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id: ${client.id} connected`);

    try {
      let token = client.handshake.headers.authorization;
      if (!token) throw new Error('No token provided');

      if (token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      const userId = this.socketAuthService.verifyJwt(token);
      client.data.userId = userId;

      client.join(String(userId));
      this.logger.debug(`User ${userId} joined room ${userId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown auth error';
      this.logger.warn(
        `WebSocket auth failed for client ${client.id}: ${message}`,
      );
      client.disconnect();
      return;
    }

    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }
  handleDisconnect(client: NotificationSocket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }
  sendNotification(userId: string) {
    this.logger.debug(`Send notification to room ${userId}`);
    this.io.to(userId).emit('notification', { data: 'hello!' });
  }

  sendTransferCompletedNotification(event: BalanceTransferCompletedEventDto) {
    const userId = String(event.senderId);

    this.logger.debug(
      `Send transfer notification to room ${userId} for eventId=${event.eventId}`,
    );
    this.io.to(userId).emit('notification', {
      type: 'balance.transfer.completed',
      data: event,
    });
  }
}
