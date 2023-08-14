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

  async findOne(id: string): Promise<GameEntity> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!game) throw new NotFoundException(`Game with id: ${id} was not found`);
    return game;
  }

  private async findOneByName(name: string): Promise<GameEntity | null> {
    const game = await this.gameRepository.findOne({
      where: { name },
      relations: ['users'],
    });
    if (!game) return null;
    return game;
  }

  async upsert(
    userId: string,
    createGamesDto: CreateGamesDto,
  ): Promise<GameEntity[]> {
    const user = await this.usersService.findOne(userId);
    const createdGames: GameEntity[] = [];

    const work = createGamesDto.games.map(async (gameName: string) => {
      let game = await this.findOneByName(gameName);

      if (!game) {
        game = this.gameRepository.create({ name: gameName, users: [user] });
      } else {
        if (!game.users.some((u) => u.id === user.id)) {
          game.users.push(user);
        }
      }

      const savedGame = await this.gameRepository.save(game);
      createdGames.push(savedGame);
    });

    await Promise.all(work);
    return createdGames;
  }

  async remove(userId: string, gameId: string): Promise<void> {
    const game = await this.findOne(gameId);
    const updatedUsers = game.users.filter((user) => user.id !== userId);

    if (updatedUsers.length === 0) {
      await this.gameRepository.remove(game);
    } else {
      Object.assign(game, { users: updatedUsers });
      await this.gameRepository.save(game);
    }
  }
}
