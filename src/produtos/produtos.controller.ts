import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ProdutosService } from './produtos.service'
import { CreateProdutoDto } from './dto/CreateProdutoDto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  criar(@Body() dto: CreateProdutoDto) {
    return this.produtosService.criar(dto)
  }

  @Get()
  listar() {
    return this.produtosService.listar()
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.produtosService.buscarPorId(Number(id))
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.produtosService.remover(Number(id))
  }
}