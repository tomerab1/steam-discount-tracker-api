import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EncryptService } from '../iam/encrypt/encrypt.service';
import { PostgresError } from '../common/postgresErrors.enum';

@Injectable()
export class PersistUsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly encryptService: EncryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const encPhone = this.encryptService.encrypt(createUserDto.phoneNumber);
      const encEmail = this.encryptService.encrypt(createUserDto.email);

      const user = await this.usersRepository.create({
        ...createUserDto,
        email: encEmail,
        phoneNumber: encPhone,
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

  async update(id: string, updateUserDto: UpdateUserDto) {}

  async delete(id: string) {}
}
