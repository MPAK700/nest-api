import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Profile } from '../profile/entity/profile.entity.ts';
import { Repository } from 'typeorm';
import { Process, Processor } from '@nestjs/bull';

export const BALANCE_QUEUE = 'balance-queue';
export const RESET_BALANCE = 'reset-balance';

@Processor(BALANCE_QUEUE)
@Injectable()
export class BalanceResetProcessor {
  private readonly logger = new Logger(BalanceResetProcessor.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}
  @Process(RESET_BALANCE)
  async resetAllBalances() {
    this.logger.log('Resetting balance job started');

    await this.profileRepository.updateAll({ balance: '0' });

    this.logger.log('Resetting balance job successfully finished');
  }
}
