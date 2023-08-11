import { Module } from '@nestjs/common';
import { PersistUsersService } from './persist-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [PersistUsersService],
})
export class PersistUsersModule {}