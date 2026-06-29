import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
    };
  }
}
