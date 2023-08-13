import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { EncryptModule } from '../iam/encrypt/encrypt.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), EncryptModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
