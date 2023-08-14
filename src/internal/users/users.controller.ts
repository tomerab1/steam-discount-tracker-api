import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { GamesService } from './games.service';
import { CreateGamesDto } from './dto/create-games.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gamesService: GamesService,
  ) {}

  @Get()
  findUsers() {
    return this.usersService.find();
  }

  @Get('/games')
  findGames() {
    return this.gamesService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('/:id/games')
  addGamesToUser(
    @Param('id') id: string,
    @Body() createGamesDto: CreateGamesDto,
  ) {
    return this.gamesService.createOrUpdate(id, createGamesDto);
  }

  @Patch('/:id/games')
  updateGames(@Param('id') id: string, @Body() createGamesDto: CreateGamesDto) {
    return this.gamesService.createOrUpdate(id, createGamesDto);
  }
}
