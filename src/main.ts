import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { API_PREFIX } from './internal/common/constants';
import { ConfigService } from '@nestjs/config';
import { SerializeInterceptor } from './internal/common/interceptors/serialize.interceptor';
import { UserEntity } from './internal/users/entity/user.entity';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableShutdownHooks();
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalInterceptors(new SerializeInterceptor(UserEntity));

  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(configService.get('PORT'));
}
bootstrap();
