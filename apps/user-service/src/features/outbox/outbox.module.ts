import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEvent } from './entity/outbox-event.entity.ts';
import { OUTBOX_KAFKA_SERVICE, OutboxProcessor } from './outbox.processor.ts';
import { OutboxService } from './outbox.service.ts';
import { parseKafkaBrokers } from '../../../../../libs/contracts/src/kafka/parse-kafka-brokers.ts';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([OutboxEvent]),
    ClientsModule.registerAsync([
      {
        name: OUTBOX_KAFKA_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow<string>('KAFKA_CLIENT_ID'),
              brokers: parseKafkaBrokers(
                configService.getOrThrow<string>('KAFKA_BROKERS'),
              ),
            },
            producerOnlyMode: true,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [OutboxProcessor, OutboxService],
  exports: [OutboxService],
})
export class OutboxModule {}
