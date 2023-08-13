import { Module } from '@nestjs/common';
import { PersistUsersService } from './persist-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { EncryptModule } from '../iam/encrypt/encrypt.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), EncryptModule],
  providers: [PersistUsersService],
  exports: [PersistUsersService],
})
export class PersistUsersModule {}
