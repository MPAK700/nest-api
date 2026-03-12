import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bull';
import { BALANCE_QUEUE, RESET_BALANCE } from './balance-reset.processor.ts';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BalanceResetService {
  constructor(@InjectQueue(BALANCE_QUEUE) private readonly queue: Queue) {}

  async resetAllBalances() {
    await this.queue.add(RESET_BALANCE);
    return { status: 'Balance reset job enqueued' };
  }

  @Cron('*/10 * * * *')
  async handleCron() {
    await this.resetAllBalances();
  }
}
