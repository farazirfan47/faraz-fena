import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BullModule } from '@nestjs/bull';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ENABLEING CORS
  app.enableCors();
  await app.listen(8000);
}
bootstrap();
