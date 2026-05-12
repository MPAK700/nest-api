export const BALANCE_TRANSFER_COMPLETED_EVENT = 'balance.transfer.completed';

export interface BalanceTransferCompletedEventDto {
  eventId: number;
  senderId: number;
  receiverId: number;
  amount: string;
}
