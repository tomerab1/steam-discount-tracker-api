import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import JwtConfig from '../config/jwt.config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(requset: Request) {}
}
