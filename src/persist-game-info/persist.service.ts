import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { EVENT_GAME_INFO_FETCHED } from 'src/steam-data-fetcher/constants';
import { SteamGamesInfo } from 'src/steam-data-fetcher/payloads/steam-games-info.payload';
import { GameInfoEntity } from './entities/game-info.entity';
import { Repository } from 'typeorm';
import { SteamGameInfo } from 'src/steam-data-fetcher/payloads/steam-app.payload';
import { EMPTY_STRING } from 'src/common/constants';
import { Like } from 'typeorm';
import { BATCH_SIZE } from './constants';

@Injectable()
export class PersistService {
  private readonly batch: Partial<GameInfoEntity>[];
  private isProcessing: boolean;

  constructor(
    @InjectRepository(GameInfoEntity)
    private readonly gameInfoRepo: Repository<GameInfoEntity>,
  ) {
    this.batch = [];
    this.isProcessing = false;
  }

  async findGameInfo(name: string): Promise<GameInfoEntity[]> {
    const gameInfo = await this.gameInfoRepo.find({
      where: { name: Like(`%${name.toLowerCase()}%`) },
    });
    if (!gameInfo) {
      throw new NotFoundException(`Cannot find game with name: ${name}`);
    }
    return gameInfo;
  }

  @OnEvent(EVENT_GAME_INFO_FETCHED, { async: true, promisify: true })
  private async persistData(payload: SteamGamesInfo) {
    payload.apps.forEach(async (info: SteamGameInfo) => {
      if (info.name !== EMPTY_STRING) {
        Object.assign(info, { name: info.name.trim().toLowerCase() });
        this.batch.push(info);

        if (this.batch.length >= BATCH_SIZE && !this.isProcessing) {
          this.isProcessing = true;
          await this.processBatch();
          this.isProcessing = false;
        }
      }
    });

    await this.processRemaining();
  }

  private async processRemaining() {
    this.isProcessing = false;

    while (this.batch.length > 0) {
      if (!this.isProcessing) {
        this.isProcessing = true;
        await this.processBatch();
        this.isProcessing = false;
      }
    }
  }

  private async processBatch() {
    try {
      const currentBatch = this.batch.splice(0, BATCH_SIZE);
      await this.gameInfoRepo.upsert(currentBatch, {
        conflictPaths: { appid: true },
        skipUpdateIfNoValuesChanged: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
