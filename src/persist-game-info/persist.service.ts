import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { EVENT_GAME_INFO_FETCHED } from 'src/steam-data-fetcher/constants';
import { SteamFetchResponse } from 'src/steam-data-fetcher/payloads/steam-fetch-response.payload';
import { GameInfoEntity } from './entities/game-info.entity';
import { Repository } from 'typeorm';
import { SteamGameInfo } from 'src/steam-data-fetcher/payloads/steam-app.payload';

@Injectable()
export class PersistService {
  constructor(
    @InjectRepository(GameInfoEntity)
    private readonly gameInfoRepo: Repository<GameInfoEntity>,
  ) {}

  @OnEvent(EVENT_GAME_INFO_FETCHED, { async: true, promisify: true })
  persistData(payload: SteamFetchResponse) {
    payload.apps.forEach(async (info: SteamGameInfo) => {
      if (info.name !== '') {
        const gameInfoEntity = await this.gameInfoRepo.create({ ...info });
        await this.gameInfoRepo.save(gameInfoEntity);
      }
    });
  }
}
