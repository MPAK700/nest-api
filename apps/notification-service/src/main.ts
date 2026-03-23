import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module.ts';
import { parseKafkaBrokers } from '../../../libs/contracts/src/kafka/parse-kafka-brokers.ts';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID ?? 'notification-service',
        brokers: parseKafkaBrokers(
          process.env.KAFKA_BROKERS ?? 'localhost:9092',
        ),
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID ?? 'notification-service-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 4000);
}
bootstrap();
