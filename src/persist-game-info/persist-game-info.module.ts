import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameInfoEntity } from './entities/game-info.entity';
import { PersistService } from './persist.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameInfoEntity])],
  providers: [PersistService],
})
export class PersistGameInfoModule {}
