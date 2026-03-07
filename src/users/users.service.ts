import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserPublic } from '../common/interfaces';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getMe(userId: number): Promise<UserPublic> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateMe(userId: number, dto: UpdateUserDto): Promise<UserPublic> {
    if (dto.name === undefined) {
      return this.getMe(userId);
    }

    const user = await this.usersRepository.updateName(userId, dto.name);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
