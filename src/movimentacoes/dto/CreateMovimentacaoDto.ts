import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export enum TipoMovimentacao {
  ENTRADA = 'entrada',
  SAIDA = 'saida',
}

export class CreateMovimentacaoDto {

  @IsEnum(TipoMovimentacao)
  tipo: TipoMovimentacao;

  @IsInt()
  @IsPositive()
  quantidade: number;

  @IsInt()
  @IsNotEmpty()
  produtoId: number;
}