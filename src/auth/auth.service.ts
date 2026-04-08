import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/CreateUsuarioDto';
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUsuarioDto) {
    const { email, senha } = dto;

    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      throw new ConflictException('Email já cadastrado');
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = this.usuarioRepository.create({
      email,
      senha: senhaCriptografada,
    });

    await this.usuarioRepository.save(novoUsuario);

    return {
      message: 'Usuário cadastrado com sucesso',
      usuario: {
        id: novoUsuario.id,
        email: novoUsuario.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const { email, senha } = dto;

    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Login realizado com sucesso',
      access_token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
      },
    };
  }
}