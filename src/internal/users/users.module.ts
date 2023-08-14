import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { GameEntity } from './entity/game.entity';
import { GamesService } from './games.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, GameEntity])],
  providers: [UsersService, GamesService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
