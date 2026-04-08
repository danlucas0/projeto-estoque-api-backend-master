import { Test, TestingModule } from '@nestjs/testing';
import { MovimentacaoService } from './movimentacoes.service';

describe('MovimentacoesService', () => {
  let service: MovimentacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimentacaoService],
    }).compile();

    service = module.get<MovimentacaoService>(MovimentacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
