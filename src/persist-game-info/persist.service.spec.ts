import { Test, TestingModule } from '@nestjs/testing';
import { PersistService } from './persist.service';

describe('PersistService', () => {
  let service: PersistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersistService],
    }).compile();

    service = module.get<PersistService>(PersistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
