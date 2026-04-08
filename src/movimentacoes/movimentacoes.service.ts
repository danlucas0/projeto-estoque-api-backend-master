import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimentacao } from './movimentacao.entity';
import { Produto } from 'src/produtos/produto.entity';
import { CreateMovimentacaoDto, TipoMovimentacao } from './dto/CreateMovimentacaoDto';

@Injectable()
export class MovimentacaoService {
  constructor(
    @InjectRepository(Movimentacao)
    private movimentacaoRepository: Repository<Movimentacao>,

    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async create(dto: CreateMovimentacaoDto): Promise<Movimentacao> {
    const { produtoId, tipo, quantidade } = dto;

    const produto = await this.produtoRepository.findOne({ where: { id: produtoId } });

    if (!produto) {
      throw new NotFoundException(`Produto com id ${produtoId} não encontrado`);
    }

    if (tipo === TipoMovimentacao.SAIDA) {
      if (produto.estoque < quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente. Disponível: ${produto.estoque}, solicitado: ${quantidade}`,
        );
      }
      produto.estoque -= quantidade;
    } else {
      produto.estoque += quantidade;
    }

    await this.produtoRepository.save(produto);

    const movimentacao = this.movimentacaoRepository.create({ produto, tipo, quantidade });
    return await this.movimentacaoRepository.save(movimentacao);
  }

  async findAll(): Promise<Movimentacao[]> {
    return this.movimentacaoRepository.find({ order: { data: 'DESC' } });
  }
}