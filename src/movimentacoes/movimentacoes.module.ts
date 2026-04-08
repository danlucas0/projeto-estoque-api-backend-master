import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimentacaoService } from './movimentacoes.service';
import { MovimentacaoController } from './movimentacoes.controller';
import { Movimentacao } from './movimentacao.entity';
import { Produto } from 'src/produtos/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movimentacao, Produto])],
  controllers: [MovimentacaoController],
  providers: [MovimentacaoService],
})
export class MovimentacaoModule {}