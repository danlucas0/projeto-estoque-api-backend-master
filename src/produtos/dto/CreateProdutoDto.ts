import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  nome: string

  @IsString()
  @IsNotEmpty()
  descricao: string

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(999999)
  estoque: number

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(999999)
  estoqueMinimo: number
}