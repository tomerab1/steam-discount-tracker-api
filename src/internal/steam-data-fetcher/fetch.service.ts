import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosError, AxiosResponse } from 'axios';
import { first, firstValueFrom } from 'rxjs';
import {
  EVENT_DISCOUNTS_INFO_FETCHED,
  EVENT_GAME_INFO_FETCHED,
} from './constants';
import { SteamGamesInfo } from './payloads/steam-games-info.payload';
import { spec } from 'node:test/reporters';

@Injectable()
export class FetchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchDiscounts(): Promise<void> {
    try {
      this.fetchData(
        this.configService.get('BASE_DISCOUNTS_URL'),
        (res: any) => {
          const { specials } = res.data;

          console.log(specials);

          // this.eventEmitter.emit(
          //   EVENT_DISCOUNTS_INFO_FETCHED,
          //   applist as SteamGamesInfo,
          // );
        },
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.code, error.message);
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async fetchSteamApps(): Promise<void> {
    try {
      this.fetchData(this.configService.get('BASE_FETCH_URL'), (res: any) => {
        const { data } = res;
        const { applist } = data;

        this.eventEmitter.emit(
          EVENT_GAME_INFO_FETCHED,
          applist as SteamGamesInfo,
        );
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.code, error.message);
      }
    }
  }

  private async fetchData<T>(url: string, extractDataCb: (res: any) => void) {
    Logger.debug(`Started fetching data from: ${url}`);
    const responseStream$ = this.httpService.get(url);
    const responseStream = await firstValueFrom(responseStream$);
    return extractDataCb(responseStream);
  }
}
