import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { HashService } from './hash/hash.service';
import { EncryptService } from './encrypt/encrypt.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';

@Module({
  providers: [AuthService, HashService, EncryptService],
  imports: [
    UsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    PassportModule,
  ],
  controllers: [AuthController],
})
export class IamModule {}
