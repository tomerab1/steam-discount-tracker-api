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
import { PostgresError } from '../common/postgresErrors.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async find() {
    return await this.usersRepository.find({
      relations: { games: true },
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { games: true },
    });
    if (!user) throw new NotFoundException('User was not found');
    return user;
  }

  async findOneEmail(email: string) {
    console.log(email);
    const user = await this.usersRepository.findOne({
      where: { hashedEmail: email },
    });
    if (!user) throw new NotFoundException('User was not found');
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepository.create({
        ...createUserDto,
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error?.code === PostgresError.UniqueViolation) {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
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
