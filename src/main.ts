import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// TODO: Add sse which clients can sub to

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
