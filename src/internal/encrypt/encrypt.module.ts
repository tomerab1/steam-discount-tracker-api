import { Module } from '@nestjs/common';
import { EncryptService } from './encrypt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [EncryptService],
  imports: [ConfigModule],
})
export class EncryptModule {}
