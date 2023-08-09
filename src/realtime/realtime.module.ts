import { Module } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { RealtimeGateway } from './realtime.gateway';
import { PersistGameInfoModule } from 'src/internal/persist-game-info/persist-game-info.module';
import { CacheModule } from 'src/internal/cache/cache.module';

@Module({
  imports: [PersistGameInfoModule, CacheModule],
  providers: [RealtimeGateway, RealtimeService],
})
export class RealtimeModule {}
