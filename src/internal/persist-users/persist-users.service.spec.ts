import { Test, TestingModule } from '@nestjs/testing';
import { PersistUsersService } from './persist-users.service';

describe('PersistUsersService', () => {
  let service: PersistUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersistUsersService],
    }).compile();

    service = module.get<PersistUsersService>(PersistUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
