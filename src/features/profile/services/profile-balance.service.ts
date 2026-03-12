import { TransferDTO } from '../dto/transfer.dto.ts';
import { Transactional } from 'typeorm-transactional';
import { Decimal } from 'decimal.js';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entity/profile.entity.ts';
import { TransferResponseDTO } from '../dto/transfer-response.dto.ts';

@Injectable()
export class ProfileBalanceService {
  private readonly logger = new Logger(ProfileBalanceService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  @Transactional()
  async transfer(
    id: number,
    balanceTransferDto: TransferDTO,
  ): Promise<TransferResponseDTO> {
    this.logger.debug(
      `Transfer start: from=${id} to=${balanceTransferDto.destinationId} amount=${balanceTransferDto.amount}`,
    );
    const sender = await this.profileRepository.findOne({
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!sender) {
      this.logger.warn(`Transfer failed: sender id=${id} not found`);
      throw new NotFoundException();
    }

    const receiver = await this.profileRepository.findOne({
      where: { id: balanceTransferDto.destinationId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!receiver) {
      this.logger.warn(
        `Transfer failed: receiver id=${balanceTransferDto.destinationId} not found`,
      );
      throw new NotFoundException();
    }

    const decimalAmount = new Decimal(balanceTransferDto.amount);
    const senderBalance = new Decimal(sender.balance);

    if (senderBalance.lt(decimalAmount)) {
      this.logger.warn(
        `Transfer failed: sender id=${id} insufficient funds for amount=${balanceTransferDto.amount}`,
      );
      throw new BadRequestException('Insufficient funds');
    }

    sender.balance = senderBalance.minus(decimalAmount).toFixed(2);
    receiver.balance = new Decimal(receiver.balance)
      .plus(decimalAmount)
      .toFixed(2);

    await this.profileRepository.save([sender, receiver]);
    this.logger.log(
      `Transfer success: from=${id} to=${balanceTransferDto.destinationId} amount=${balanceTransferDto.amount} newSenderBalance=${sender.balance} newReceiverBalance=${receiver.balance}`,
    );
    return {
      success: true,
      sender: id,
      receiver: balanceTransferDto.destinationId,
      amount: balanceTransferDto.amount,
    };
  }
}
