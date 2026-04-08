import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosModule } from './produtos/produtos.module';
import { MovimentacaoModule } from './movimentacoes/movimentacoes.module';
import { AuthModule } from './auth/auth.module';

 
@Module({
  imports: [TypeOrmModule.forRoot({
    type:'mysql',
    host:'localhost',
    port:3306,
    username:'root',
    password:'root',
    database:'estoque_db',
    autoLoadEntities:true,
    synchronize:true
  }), ProdutosModule, MovimentacaoModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
