import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async createComment(comment: CreateCommentDto, user: User) {
    const newComment = this.commentRepo.create({ ...comment, user });
    return await this.commentRepo.save(newComment);
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    return await this.commentRepo.findOne({ where: { id } });
  }

  async findAll() {
    return await this.commentRepo.find({ relations: ['user'] });
  }

  async update(id: number, comment: CreateCommentDto) {
    return await this.commentRepo.update(id, comment);
  }

  async delete(id: number) {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return await this.commentRepo.delete(id);
  }
}
