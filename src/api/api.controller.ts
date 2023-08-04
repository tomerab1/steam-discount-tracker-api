import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiQueryDto } from './dto/api-query.dto';
import { CACHE_12_HOURS } from './constants';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  @Header('Cache-Control', CACHE_12_HOURS)
  find(@Query() apiQueryDto: ApiQueryDto) {
    return this.apiService.find(apiQueryDto);
  }
}
