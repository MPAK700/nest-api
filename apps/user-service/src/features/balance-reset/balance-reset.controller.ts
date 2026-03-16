import { Controller, Post } from '@nestjs/common';
import { BalanceResetService } from './balance-reset.service.ts';

@Controller('balance-reset')
export class BalanceResetController {
  constructor(private readonly balanceResetService: BalanceResetService) {}

  @Post('reset-all')
  async resetAllBalances() {
    return this.balanceResetService.resetAllBalances();
  }
}
