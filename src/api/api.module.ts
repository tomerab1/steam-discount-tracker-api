import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { PersistGameInfoModule } from 'src/internal/persist-game-info/persist-game-info.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [PersistGameInfoModule],
})
export class UserApiModule {}
