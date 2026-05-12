import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileBalanceService } from '../services/profile-balance.service.ts';
import { TransferDTO } from '../dto/transfer.dto.ts';
import { GetUser } from '../../../common/decorators/get-user.decorator.ts';
import type { BaseUser } from '../../../auth/types/base-user.type.ts';
import { JwtAccessGuard } from '../../../auth/guard/access.guard.ts';
import { TransferResponseDTO } from '../dto/transfer-response.dto.ts';

@Controller('balance')
@UseGuards(JwtAccessGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileBalanceController {
  constructor(private readonly profileBalanceService: ProfileBalanceService) {}

  @Post('transfer')
  async transfer(
    @GetUser() user: BaseUser,
    @Body() balanceTransferDto: TransferDTO,
  ): Promise<TransferResponseDTO> {
    const result = await this.profileBalanceService.transfer(
      user.id,
      balanceTransferDto,
    );

    return result;
  }
}
