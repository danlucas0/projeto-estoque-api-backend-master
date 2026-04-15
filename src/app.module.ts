import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProdutosModule } from './produtos/produtos.module';
import { MovimentacaoModule } from './movimentacoes/movimentacoes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: Number(configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        },
      }),
    }),

    ProdutosModule,
    MovimentacaoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

console.log('DB HOST:', process.env.DATABASE_HOST);
console.log('DB PORT:', process.env.DATABASE_PORT);
console.log('DB USER:', process.env.DATABASE_USER);
console.log('DB NAME:', process.env.DATABASE_NAME);
console.log('JWT SECRET EXISTS:', !!process.env.JWT_SECRET);