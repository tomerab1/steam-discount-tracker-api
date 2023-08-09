import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SteamDataFetcherModule } from './internal/steam-data-fetcher/steam-data-fetcher.module';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PersistGameInfoModule } from './internal/persist-game-info/persist-game-info.module';
import { RealtimeModule } from './realtime/realtime.module';
import { CacheModule } from './internal/cache/cache.module';

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
        BASE_URL: Joi.string().required(),
        BASE_FETCH_URL: Joi.string().required(),
        BASE_DISCOUNTS_URL: Joi.string().required(),
        PORT: Joi.number().default(3000),
        DB_MAX_RETRY: Joi.number().optional(),
      }),
    }),
    HttpModule,
    SteamDataFetcherModule,
    PersistGameInfoModule,
    RealtimeModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
