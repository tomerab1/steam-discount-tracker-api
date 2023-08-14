import { HttpStatus, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EVENT_DISCOUNTS_INFO_FETCHED,
  EVENT_GAME_INFO_FETCHED,
} from 'src/steam-data-fetcher/constants';
import { SteamGamesInfo } from 'src/steam-data-fetcher/dto/steam-games-info.dto';
import { SteamGameInfo } from 'src/steam-data-fetcher/dto/steam-app.dto';
import { EMPTY_STRING } from 'src/common/constants';
import { BATCH_SIZE, GAME_INFO_INDEX } from './constants';
import { SteamDiscountsDto } from '../steam-data-fetcher/dto/steam-discounts.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class PersistService {
  private readonly batch: SteamGameInfo[] = [];
  private isProcessing = false;

  constructor(private readonly elasticserchService: ElasticsearchService) {
    this.createIndex();
  }

  async search(text: string) {
    try {
      const searchQuery = {
        index: GAME_INFO_INDEX,
        body: {
          query: {
            match: { 'doc.name': text },
          },
        },
      };

      return await this.elasticserchService.search(searchQuery);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async createIndex() {
    try {
      const doesIndexExists = await this.elasticserchService.indices.exists({
        index: GAME_INFO_INDEX,
      });

      if (!doesIndexExists) {
        await this.elasticserchService.indices.create(
          {
            index: GAME_INFO_INDEX,
            mappings: {
              properties: {
                appid: { type: 'integer' },
                name: { type: 'text' },
              },
            },
          },
          { ignore: [HttpStatus.BAD_REQUEST] },
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
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

  private async indexData(data: SteamGameInfo[]) {
    try {
      const operations = data.flatMap((doc) => [
        { index: { _index: GAME_INFO_INDEX, _id: doc.appid } },
        { doc, doc_as_upsert: true },
      ]);

      return await this.elasticserchService.bulk({
        refresh: true,
        operations,
      });
    } catch (error) {
      throw error;
    }
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
      return await this.indexData(currentBatch);
    } catch (error) {
      console.log(error);
    }
  }
}
