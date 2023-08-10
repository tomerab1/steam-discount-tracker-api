import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { REDIS_CLIENT, REDIS_JSON_ROOT } from './constants';
import { RedisClientType } from 'redis';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_DISCOUNTS_INFO_FETCHED } from '../steam-data-fetcher/constants';
import { SteamDiscountsDto } from '../steam-data-fetcher/dto/steam-discounts.dto';
import { SteamDiscountItemDto } from '../steam-data-fetcher/dto/steam-discount-item.dto';
import { epochToSeconds, objectAssignExact } from '../common/helpers';

@Injectable()
export class CacheService implements OnModuleDestroy, OnModuleInit {
  private m_isConnected = false;

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,
  ) {}

  async onModuleInit() {
    try {
      await this.redisClient.connect();
      this.m_isConnected = true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.redisClient.flushAll();
      await this.redisClient.disconnect();
      this.m_isConnected = false;
    } catch (error) {
      throw error;
    }
  }

  isConnected(): boolean {
    return this.m_isConnected;
  }

  async set(key: string, value: string) {
    try {
      await this.redisClient.set(key, value);
    } catch (error) {
      throw error;
    }
  }

  async del(key: string) {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      throw error;
    }
  }

  private getEmptyCacheObj() {
    return {
      id: 0,
      discount_expiration: 0,
      discount_percent: 0,
      name: '',
      original_price: 0,
      final_price: 0,
      currency: '',
    } satisfies SteamDiscountItemDto;
  }

  @OnEvent(EVENT_DISCOUNTS_INFO_FETCHED, { async: true, promisify: true })
  private persistDiscounts(payload: SteamDiscountsDto) {
    payload.items.forEach(async (item: SteamDiscountItemDto) => {
      try {
        const { id } = item;
        const toCache = objectAssignExact(this.getEmptyCacheObj(), item);

        await this.redisClient.json.set(
          id.toString(),
          REDIS_JSON_ROOT,
          JSON.stringify(toCache),
          {
            NX: true,
          },
        );

        const currentTTL: number = await this.redisClient.ttl(id.toString());

        if (currentTTL <= 0) {
          await this.redisClient.expire(
            id.toString(),
            item.discount_expiration - epochToSeconds(),
          );
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }
}
