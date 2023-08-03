import { Module } from '@nestjs/common';
import { UserApiService } from './user-api.service';
import { UserApiController } from './user-api.controller';
import { PersistGameInfoModule } from 'src/persist-game-info/persist-game-info.module';

@Module({
  controllers: [UserApiController],
  providers: [UserApiService],
  imports: [PersistGameInfoModule],
})
export class UserApiModule {}
