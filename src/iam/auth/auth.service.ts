import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { HashService } from '../hash/hash.service';
import { EncryptService } from '../encrypt/encrypt.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptService: EncryptService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const email = this.encryptService.encrypt(createUserDto.email);
    const phoneNumber = this.encryptService.encrypt(createUserDto.phoneNumber);
    const password = await this.hashService.hash(createUserDto.password);

    return await this.usersService.create({
      ...createUserDto,
      email,
      phoneNumber,
      password,
    });
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findOneEmail(email);
    const cmpResult = await this.hashService.compare(password, user.password);

    if (!user || !cmpResult) null;

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: accessToken,
    };
  }
}
