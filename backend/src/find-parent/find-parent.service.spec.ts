import { Test, TestingModule } from '@nestjs/testing';
import { FindParentService } from './find-parent.service';

describe('FindParentService', () => {
  let service: FindParentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindParentService],
    }).compile();

    service = module.get<FindParentService>(FindParentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
