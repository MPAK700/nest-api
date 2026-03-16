import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entity/profile.entity.ts';
import { BalanceResetController } from './balance-reset.controller.ts';
import { BalanceResetService } from './balance-reset.service.ts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  BALANCE_QUEUE,
  BalanceResetProcessor,
} from './balance-reset.processor.ts';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: BALANCE_QUEUE,
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: BALANCE_QUEUE,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [BalanceResetController],
  providers: [BalanceResetService, BalanceResetProcessor],
})
export class BalanceResetModule {}
