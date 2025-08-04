import { Test, TestingModule } from '@nestjs/testing';
import { AccessmgtService } from './accessmgt.service';

describe('AccessmgtService', () => {
  let service: AccessmgtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessmgtService],
    }).compile();

    service = module.get<AccessmgtService>(AccessmgtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
