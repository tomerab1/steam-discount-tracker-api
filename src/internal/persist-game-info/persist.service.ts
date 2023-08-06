import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EVENT_DISCOUNTS_INFO_FETCHED,
  EVENT_GAME_INFO_FETCHED,
} from 'src/internal/steam-data-fetcher/constants';
import { SteamGamesInfo } from 'src/internal/steam-data-fetcher/dto/steam-games-info.dto';
import { GameInfoEntity } from './entities/game-info.entity';
import { Repository } from 'typeorm';
import { SteamGameInfo } from 'src/internal/steam-data-fetcher/dto/steam-app.dto';
import { EMPTY_STRING } from 'src/internal/common/constants';
import { BATCH_SIZE } from './constants';
import { ApiQueryDto } from 'src/api/dto/api-query.dto';
import { SteamDiscountsDto } from '../steam-data-fetcher/dto/steam-discounts.dto';

@Injectable()
export class PersistService {
  private readonly batch: Partial<GameInfoEntity>[] = [];
  private isProcessing = false;

  constructor(
    @InjectRepository(GameInfoEntity)
    private readonly gameInfoRepo: Repository<GameInfoEntity>,
  ) {}

  async findGameInfo(apiQueryDto: ApiQueryDto): Promise<GameInfoEntity[]> {
    const { name } = apiQueryDto;
    const gameInfo = await this.gameInfoRepo.find({
      where: { name },
    });

    if (!gameInfo) {
      throw new NotFoundException(`Cannot find game with name: ${name}`);
    }

    return gameInfo;
  }

  @OnEvent(EVENT_DISCOUNTS_INFO_FETCHED, { async: true, promisify: true })
  private async persistDiscounts(payload: SteamDiscountsDto) {
    payload.items.forEach((item) => {});
  }

  @OnEvent(EVENT_GAME_INFO_FETCHED, { async: true, promisify: true })
  private async persistData(payload: SteamGamesInfo) {
    payload.apps.forEach(async (info: SteamGameInfo) => {
      if (info.name !== EMPTY_STRING) {
        Object.assign(info, { name: info.name.trim() });
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
