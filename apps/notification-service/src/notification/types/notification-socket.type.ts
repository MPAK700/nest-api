import type { Socket } from 'socket.io';

export interface NotificationSocketData {
  userId: string;
}

export type NotificationSocket = Socket<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  NotificationSocketData
>;
