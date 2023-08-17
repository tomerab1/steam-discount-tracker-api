import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GamesService } from './games.service';
import { CreateGamesDto } from './dto/create-games.dto';
import { JwtAuthGuard } from 'src/iam/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('/:id/games')
  addGamesToUser(
    @Param('id') id: string,
    @Body() createGamesDto: CreateGamesDto,
  ) {
    return this.gamesService.upsert(id, createGamesDto);
  }

  @Patch('/:id/games')
  updateGames(@Param('id') id: string, @Body() createGamesDto: CreateGamesDto) {
    return this.gamesService.upsert(id, createGamesDto);
  }

  @Delete('/:userid/games/:gameid')
  removeUserFromGame(
    @Param('userid') userid: string,
    @Param('gameid') gameid: string,
  ) {
    return this.gamesService.remove(userid, gameid);
  }
}
