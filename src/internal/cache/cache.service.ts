import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { REDIS_CLIENT } from './constants';
import { RedisClientType } from 'redis';

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
}
