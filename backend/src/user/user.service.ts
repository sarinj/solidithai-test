import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.repo.find({
      where: { email: createUserDto.email },
    });

    if (userExists.length > 0) {
      throw new BadRequestException('Email in use.');
    }

    const user = this.repo.create(createUserDto);
    await this.repo.save(user);
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.repo.update(id, updateUserDto);
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    return await this.repo.findOne({ where: { id } });
  }

  async findOneWithUserName(username: string) {
    return await this.repo.findOne({ where: { email: username } });
  }

  async find(search: string, offset: number, limit: number) {
    const [users, total] = await this.repo.findAndCount({
      where: search
        ? [{ email: Like(`%${search}%`) }, { name: Like(`%${search}%`) }]
        : {},
      skip: offset,
      take: limit,
      select: ['id', 'email', 'name'],
    });
    return { users, total };
  }
}
