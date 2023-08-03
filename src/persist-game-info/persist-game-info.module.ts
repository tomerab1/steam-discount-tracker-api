import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameInfoEntity } from './entities/game-info.entity';
import { PersistService } from './persist.service';
import PQueue from 'p-queue';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([GameInfoEntity])],
  providers: [
    PersistService,
    {
      provide: PQueue,
      useFactory: async (configService: ConfigService) => {
        const concurrency = configService.get<number>('PQUEUE_CONCURRENCY');
        Logger.debug(`[!] Creating new PQueue, concurrency: ${concurrency}`);
        return new PQueue({
          concurrency,
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class PersistGameInfoModule {}
