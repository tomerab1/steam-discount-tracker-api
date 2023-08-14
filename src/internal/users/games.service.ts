import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './entity/game.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { CreateGamesDto } from './dto/create-games.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly usersService: UsersService,
  ) {}

  async findOneByName(name: string) {
    const game = await this.gameRepository.findOne({ where: { name } });
    if (!game) return null;
    return game;
  }

  async create(id: string, createGamesDto: CreateGamesDto) {
    const user = await this.usersService.findOne(id);
    const createdGames = [];

    const work = createGamesDto.games.map(async (gameName: string) => {
      let gameEntity = undefined;

      gameEntity = await this.gameRepository.create({
        name: gameName,
        users: [user],
      });

      return createdGames.push(await this.gameRepository.save(gameEntity));
    });

    await Promise.all(work);
    return createdGames;
  }
}
