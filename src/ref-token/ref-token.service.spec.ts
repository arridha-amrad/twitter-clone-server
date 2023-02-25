import { Test, TestingModule } from '@nestjs/testing';
import { RefTokenService } from './ref-token.service';

describe('RefTokenService', () => {
  let service: RefTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefTokenService],
    }).compile();

    service = module.get<RefTokenService>(RefTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
