import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { EVENT_GAME_INFO_FETCHED } from './constants';
import { SteamFetchResponse } from './payloads/steam-fetch-response.payload';

@Injectable()
export class FetchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchData(): Promise<void> {
    try {
      Logger.debug(
        `Started fetching data from: ${this.configService.get<string>(
          'BASE_FETCH_URL',
        )}`,
      );
      const data$ = this.httpService.get(
        this.configService.get<string>('BASE_FETCH_URL'),
      );
      const { data } = await firstValueFrom(data$);
      const { applist } = data;

      this.eventEmitter.emit(
        EVENT_GAME_INFO_FETCHED,
        applist as SteamFetchResponse,
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.message);
      }
    }
  }
}
