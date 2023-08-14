import { Logger, Module } from '@nestjs/common';
import { PersistService } from './persist.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        Logger.debug('[!] Initializing Elasticsearch...');
        return {
          node: configService.get('ELASTICSEARCH_NODE'),
          auth: {
            username: configService.get('ELASTICSEARCH_USERNAME'),
            password: configService.get('ELASTICSEARCH_PASSWORD'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [PersistService],
  exports: [PersistService],
})
export class PersistGameInfoModule {}
