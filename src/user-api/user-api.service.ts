import { Injectable } from '@nestjs/common';
import { CreateUserApiDto } from './dto/create-user-api.dto';
import { UpdateUserApiDto } from './dto/update-user-api.dto';

@Injectable()
export class UserApiService {
  create(createUserApiDto: CreateUserApiDto) {
    return 'This action adds a new userApi';
  }

  findAll() {
    return `This action returns all userApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userApi`;
  }

  update(id: number, updateUserApiDto: UpdateUserApiDto) {
    return `This action updates a #${id} userApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} userApi`;
  }
}
