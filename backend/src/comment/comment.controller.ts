import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  async createComment(
    @Body() body: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentService.createComment(body, user);
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() body: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    const comment = await this.commentService.findOne(parseInt(id));

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== user.id) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.commentService.update(parseInt(id), body);
  }

  @Get()
  async getComments() {
    return this.commentService.findAll();
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    return this.commentService.delete(parseInt(id));
  }
}
