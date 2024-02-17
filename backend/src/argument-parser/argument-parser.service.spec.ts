import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentParserService } from './argument-parser.service';

describe('ArgumentParserService', () => {
  let service: ArgumentParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArgumentParserService],
    }).compile();

    service = module.get<ArgumentParserService>(ArgumentParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
