import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { API_PREFIX } from './common/constants';
import { ConfigService } from '@nestjs/config';
import { SerializeInterceptor } from './common/interceptors/serialize.interceptor';
import { UserEntity } from './users/entity/user.entity';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';

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

  app.use(cookieParser());
  app.enableShutdownHooks();
  app.enableCors();
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalInterceptors(
    new SerializeInterceptor(UserEntity),
    new PerformanceInterceptor(),
  );

  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(configService.get('PORT'));
}
bootstrap();
