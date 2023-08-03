import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EVENT_GAME_INFO_FETCHED,
  EVENT_GAME_INFO_PERSISTED,
} from 'src/steam-data-fetcher/constants';
import { SteamGamesInfo } from 'src/steam-data-fetcher/payloads/steam-games-info.payload';
import { GameInfoEntity } from './entities/game-info.entity';
import { Repository } from 'typeorm';
import { SteamGameInfo } from 'src/steam-data-fetcher/payloads/steam-app.payload';
import { EMPTY_STRING } from 'src/common/constants';

@Injectable()
export class PersistService {
  constructor(
    @InjectRepository(GameInfoEntity)
    private readonly gameInfoRepo: Repository<GameInfoEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(EVENT_GAME_INFO_FETCHED, { async: true, promisify: true })
  async persistData(payload: SteamGamesInfo) {
    const savedTasks = [];

    payload.apps.forEach(async (info: SteamGameInfo) => {
      if (info.name !== EMPTY_STRING) {
        const task = async () => {
          try {
            const doesExists = await this.gameInfoRepo.findOne({
              where: { appid: info.appid },
            });
            if (!doesExists) {
              const gameInfoEntity = await this.gameInfoRepo.create({
                ...info,
              });
              await this.gameInfoRepo.save(gameInfoEntity);
            }
          } catch (error) {
            console.log(error);
          }
        };

        savedTasks.push(task());
      }
    });

    await Promise.all(savedTasks);
    this.eventEmitter.emit(EVENT_GAME_INFO_PERSISTED);
  }

  @OnEvent(EVENT_GAME_INFO_PERSISTED)
  persistPrices() {
    console.log('all data was persisted successfuly');
  }
}
