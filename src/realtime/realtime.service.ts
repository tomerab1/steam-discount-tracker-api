import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/internal/cache/cache.service';
import { PersistService } from 'src/internal/persist-game-info/persist.service';
import { Socket } from 'socket.io';

@Injectable()
export class RealtimeService {
  constructor(
    private readonly persistService: PersistService,
    private readonly cacheService: CacheService,
  ) {}

  async newConnection(client: Socket) {
    await this.cacheService.set(client.id, '');
  }

  async closeConnection(client: Socket) {
    if (this.cacheService.isConnected()) {
      await this.cacheService.del(client.id);
    }
  }

  async search(text: string) {
    return await this.persistService.search(text);
  }
}
