import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthTokenResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ id: string; email: string }> {
    const existing: User | null = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing !== null) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword: string = await bcrypt.hash(dto.password, 12);
    const user: User = this.usersRepository.create({
      email: dto.email,
      hashedPassword,
    });
    const saved: User = await this.usersRepository.save(user);
    return { id: saved.id, email: saved.email };
  }

  async login(dto: LoginDto): Promise<AuthTokenResponse> {
    const user: User | null = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches: boolean = await bcrypt.compare(
      dto.password,
      user.hashedPassword,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token: string = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
