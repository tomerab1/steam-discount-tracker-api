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

  async find() {
    return await this.gameRepository.find({ relations: { users: true } });
  }

  async findOneByName(name: string) {
    const game = await this.gameRepository.findOne({
      where: { name },
      relations: { users: true },
    });
    if (!game) return null;
    return game;
  }

  async createOrUpdate(id: string, createGamesDto: CreateGamesDto) {
    const user = await this.usersService.findOne(id);
    const createdGames = [];

    const work = createGamesDto.games.map(async (gameName: string) => {
      let gameEntity = undefined;
      const savedGame = await this.findOneByName(gameName);

      if (!savedGame) {
        gameEntity = await this.gameRepository.create({
          users: [user],
          name: gameName,
        });
      } else {
        console.log(savedGame);
        gameEntity = await this.gameRepository.preload({
          id: savedGame.id,
          users: [...savedGame.users, user],
          name: gameName,
        });
      }

      return createdGames.push(await this.gameRepository.save(gameEntity));
    });

    await Promise.all(work);
    return createdGames;
  }
}
