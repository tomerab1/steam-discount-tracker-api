import { Injectable } from '@nestjs/common';
import { PersistService } from 'src/internal/persist-game-info/persist.service';
import { ApiQueryDto } from './dto/api-query.dto';

@Injectable()
export class ApiService {
  constructor(private readonly presistService: PersistService) {}

  async find(apiQueryDto: ApiQueryDto) {
    const gameDetails = await this.presistService.findGameInfo(apiQueryDto);
    return gameDetails;
  }
}
