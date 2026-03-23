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
import { OutboxService } from '../../outbox/outbox.service.ts';

@Injectable()
export class ProfileBalanceService {
  private readonly logger = new Logger(ProfileBalanceService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly outboxService: OutboxService,
  ) {}

  @Transactional()
  async transfer(
    id: number,
    balanceTransferDto: TransferDTO,
  ): Promise<TransferResponseDTO> {
    const { destinationId, amount } = balanceTransferDto;

    this.logger.debug(
      `Transfer start: from=${id} to=${destinationId} amount=${amount}`,
    );

    if (id === destinationId) {
      this.logger.warn(`Transfer failed: self-transfer for id=${id}`);
      throw new BadRequestException('Cannot transfer to yourself');
    }

    const [firstId, secondId] =
      id < destinationId ? [id, destinationId] : [destinationId, id];

    const firstProfile = await this.profileRepository.findOne({
      where: { id: firstId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!firstProfile) {
      const missingRole = firstId === id ? 'sender' : 'receiver';
      this.logger.warn(
        `Transfer failed: ${missingRole} id=${firstId} not found`,
      );
      throw new NotFoundException();
    }

    const secondProfile = await this.profileRepository.findOne({
      where: { id: secondId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!secondProfile) {
      const missingRole = secondId === id ? 'sender' : 'receiver';
      this.logger.warn(
        `Transfer failed: ${missingRole} id=${secondId} not found`,
      );
      throw new NotFoundException();
    }

    const sender = firstId === id ? firstProfile : secondProfile;
    const receiver = firstId === id ? secondProfile : firstProfile;

    const decimalAmount = new Decimal(amount);
    const senderBalance = new Decimal(sender.balance);

    if (senderBalance.lt(decimalAmount)) {
      this.logger.warn(
        `Transfer failed: sender id=${id} insufficient funds for amount=${amount}`,
      );
      throw new BadRequestException('Insufficient funds');
    }

    sender.balance = senderBalance.minus(decimalAmount).toFixed(2);
    receiver.balance = new Decimal(receiver.balance)
      .plus(decimalAmount)
      .toFixed(2);

    await this.profileRepository.save([sender, receiver]);
    await this.outboxService.addBalanceTransferCompletedEvent({
      senderId: id,
      receiverId: destinationId,
      amount,
    });

    this.logger.log(
      `Transfer success: from=${id} to=${destinationId} amount=${amount} newSenderBalance=${sender.balance} newReceiverBalance=${receiver.balance}`,
    );

    return {
      success: true,
      sender: id,
      receiver: destinationId,
      amount,
    };
  }
}
