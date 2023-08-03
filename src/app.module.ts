import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SteamDataFetcherModule } from './steam-data-fetcher/steam-data-fetcher.module';
import { UserApiModule } from './user-api/user-api.module';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PersistGameInfoModule } from './persist-game-info/persist-game-info.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        BASE_URL: Joi.string().required(),
        BASE_FETCH_URL: Joi.string().required(),
        BASE_INFO_URL: Joi.string().required(),
        PQUEUE_CONCURRENCY: Joi.number().required(),
        PORT: Joi.number().default(3000),
        DB_MAX_RETRY: Joi.number().optional(),
      }),
    }),
    HttpModule,
    DatabaseModule,
    SteamDataFetcherModule,
    UserApiModule,
    PersistGameInfoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
