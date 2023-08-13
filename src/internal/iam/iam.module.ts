import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { PersistUsersModule } from '../persist-users/persist-users.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  imports: [
    PersistUsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class IamModule {}
