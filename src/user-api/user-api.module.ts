import { Module } from '@nestjs/common';
import { UserApiService } from './user-api.service';
import { UserApiController } from './user-api.controller';

@Module({
  controllers: [UserApiController],
  providers: [UserApiService]
})
export class UserApiModule {}
