import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Movimentacao } from './movimentacao.entity'
import { Produto } from 'src/produtos/produto.entity'
import { CreateMovimentacaoDto, TipoMovimentacao } from './dto/CreateMovimentacaoDto'

const LIMITE_ESTOQUE = 999999

@Injectable()
export class MovimentacaoService {
  constructor(
    @InjectRepository(Movimentacao)
    private movimentacaoRepository: Repository<Movimentacao>,

    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async create(dto: CreateMovimentacaoDto): Promise<Movimentacao> {
    const { produtoId, tipo, quantidade } = dto

    const produto = await this.produtoRepository.findOne({
      where: { id: produtoId },
    })

    if (!produto) {
      throw new NotFoundException(`Produto com id ${produtoId} não encontrado`)
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new BadRequestException(
        'A quantidade deve ser um número inteiro maior que zero.',
      )
    }

    if (tipo === TipoMovimentacao.SAIDA) {
      if (produto.estoque < quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente. Disponível: ${produto.estoque}, solicitado: ${quantidade}`,
        )
      }

      produto.estoque -= quantidade
    } else {
      const novoEstoque = produto.estoque + quantidade

      if (novoEstoque > LIMITE_ESTOQUE) {
        throw new BadRequestException(
          `O estoque não pode ultrapassar ${LIMITE_ESTOQUE}. Estoque atual: ${produto.estoque}.`,
        )
      }

      produto.estoque = novoEstoque
    }

    await this.produtoRepository.save(produto)

    const movimentacao = this.movimentacaoRepository.create({
      produto,
      tipo,
      quantidade,
    })

    return await this.movimentacaoRepository.save(movimentacao)
  }

  async findAll(): Promise<Movimentacao[]> {
    return this.movimentacaoRepository.find({
      order: { data: 'DESC' },
    })
  }
}