import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/internal/users/entity/user.entity';
import { UsersService } from 'src/internal/users/users.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findOneEmail(email);
    const cmpResult = await this.hashService.compare(password, user.password);

    if (!user || !cmpResult)
      throw new UnauthorizedException('email or password are incorrect');
    return user;
  }
}
