import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserApiService } from './user-api.service';
import { CreateUserApiDto } from './dto/create-user-api.dto';
import { UpdateUserApiDto } from './dto/update-user-api.dto';
import { PersistService } from 'src/persist-game-info/persist.service';

@Controller('user-api')
export class UserApiController {
  constructor(
    private readonly userApiService: UserApiService,
    private persist: PersistService,
  ) {}

  @Post()
  create(@Body() createUserApiDto: CreateUserApiDto) {
    return this.userApiService.create(createUserApiDto);
  }

  @Get()
  findAll(@Query('name') name: string) {
    return this.persist.findGameInfo(name);
    //return this.userApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userApiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserApiDto: UpdateUserApiDto) {
    return this.userApiService.update(+id, updateUserApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userApiService.remove(+id);
  }
}
