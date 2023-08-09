import { Logger, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { REDIS_CLIENT, RETRY_INTERVAL } from './constants';
import { retryStrategy } from './retry.strategy';

@Module({
  imports: [ConfigModule],
  providers: [
    CacheService,
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        Logger.debug('[!] Initializing redis');
        return createClient({
          socket: {
            reconnectStrategy: retryStrategy,
          },
          url: configService.get<string>('REDIS_URL'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
