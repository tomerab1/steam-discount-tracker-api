import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// TODO: Add sse which clients can sub to
// TODO: Cache the discounts until they expire.
// TODO: Listen to user sub event, if the game is in the cache, add the user to its list of subscribers.
//       Else, create new list where its key is the games name and append subscribers to it.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
