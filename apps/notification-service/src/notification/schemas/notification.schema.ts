import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { BalanceTransferCompletedEventDto } from '../../../../../libs/contracts/src/events/balance-transfer-completed.event.ts';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true, versionKey: false })
export class Notification {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, unique: true })
  eventId: number;

  @Prop({ type: Object, required: true })
  payload: BalanceTransferCompletedEventDto;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
