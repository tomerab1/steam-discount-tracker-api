import { Module } from '@nestjs/common';
import { FetchService } from './fetch.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [FetchService],
})
export class SteamDataFetcherModule {}
