import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common'
import { MovimentacaoService } from './movimentacoes.service'
import { CreateMovimentacaoDto } from './dto/CreateMovimentacaoDto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('movimentacoes')
export class MovimentacaoController {
  constructor(private readonly movimentacaoService: MovimentacaoService) {}

  @Post()
  create(@Body() dto: CreateMovimentacaoDto) {
    return this.movimentacaoService.create(dto)
  }

  @Get()
  findAll() {
    return this.movimentacaoService.findAll()
  }
}