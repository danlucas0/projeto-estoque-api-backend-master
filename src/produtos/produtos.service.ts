import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './produto.entity';
import { Repository } from 'typeorm';
import { CreateProdutoDto } from './dto/CreateProdutoDto';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>
  ) {}

  async criar(dto: CreateProdutoDto) {
    const nomeLimpo = dto.nome.trim().toLowerCase()

    if (dto.estoqueMinimo > dto.estoque) {
      throw new BadRequestException(
        'O estoque mínimo não pode ser maior que o estoque atual'
      )
    }

    const produtoExistente = await this.produtoRepository.findOne({
      where: { nome: nomeLimpo }
    })

    if (produtoExistente) {
      throw new ConflictException('Já existe um produto com esse nome')
    }

    const produto = this.produtoRepository.create({
      ...dto,
      nome: nomeLimpo
    })

    return this.produtoRepository.save(produto)
  }

  listar() {
    return this.produtoRepository.find()
  }

  buscarPorId(id: number) {
    return this.produtoRepository.findOneBy({ id })
  }

  remover(id: number) {
    return this.produtoRepository.delete({ id })
  }
}