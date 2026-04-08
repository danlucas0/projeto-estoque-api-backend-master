import { Movimentacao } from "src/movimentacoes/movimentacao.entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"


@Entity()
export class Produto{

    @PrimaryGeneratedColumn()
    id:number

    @Column({ unique: true })
    nome:string

    @Column()
    descricao:string

    @Column()
    estoque:number
    
    @Column()
    estoqueMinimo:number

    @OneToMany(()=>Movimentacao, (mov) => mov.produto)
    movimentacoes: Movimentacao[]
}