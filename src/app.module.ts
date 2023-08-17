import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SteamDataFetcherModule } from './steam-data-fetcher/steam-data-fetcher.module';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PersistGameInfoModule } from './persist-game-info/persist-game-info.module';
import { CacheModule } from './cache/cache.module';
import { SmsModule } from './sms/sms.module';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      validationSchema: Joi.object({
        ELASTICSEARCH_USERNAME: Joi.string().required(),
        ELASTICSEARCH_PASSWORD: Joi.string().required(),
        ELASTICSEARCH_NODE: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_PHONE_NUM: Joi.string().required(),
        BASE_URL: Joi.string().required(),
        BASE_FETCH_URL: Joi.string().required(),
        BASE_DISCOUNTS_URL: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
        JWT_REFRESH_JWT_TTL: Joi.number().required(),
        PORT: Joi.number().default(3000),
        DB_MAX_RETRY: Joi.number().optional(),
      }),
    }),
    HttpModule,
    SteamDataFetcherModule,
    PersistGameInfoModule,
    CacheModule,
    SmsModule,
    EmailModule,
    UsersModule,
    IamModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
