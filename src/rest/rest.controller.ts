import { Controller } from '@nestjs/common';
import { RestService } from './rest.service';

@Controller('rest')
export class RestController {
  constructor(private readonly restService: RestService) {}
}
