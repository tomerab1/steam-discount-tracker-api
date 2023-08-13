import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EncryptService } from '../iam/encrypt/encrypt.service';
import { PostgresError } from '../common/postgresErrors.enum';
import { HashService } from '../iam/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly encryptService: EncryptService,
    private readonly hashService: HashService,
  ) {}

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User was not found');
    return user;
  }

  async findOneEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User was not found');
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const encPhone = this.encryptService.encrypt(createUserDto.phoneNumber);
      const encEmail = this.encryptService.encrypt(createUserDto.email);
      const hashedPassword = await this.hashService.hash(
        createUserDto.password,
      );

      const user = await this.usersRepository.create({
        ...createUserDto,
        email: encEmail,
        phoneNumber: encPhone,
        password: hashedPassword,
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      console.log(error);
      if (error?.code === PostgresError.UniqueViolation) {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const email = this.encryptService.encrypt(updateUserDto?.email);
    const phoneNumber = this.encryptService.encrypt(updateUserDto?.phoneNumber);
    const savedUser = await this.findOne(id);

    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
      email: email || savedUser.email,
      phoneNumber: phoneNumber || savedUser.phoneNumber,
    });

    if (!user) throw new NotFoundException('User was not found');

    return await this.usersRepository.save(user);
  }

  async delete(id: string) {
    try {
      const user = await this.findOne(id);
      await this.usersRepository.remove(user);
    } catch (error) {
      throw error;
    }
  }
}
