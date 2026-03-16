import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module.ts';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
