import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUsers(
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);
    const offset = (pageNumber - 1) * pageSizeNumber;

    const { users, total } = await this.userService.find(
      search,
      offset,
      pageSizeNumber,
    );
    return {
      users,
      page: pageNumber,
      pageSize: pageSizeNumber,
      totalPages: Math.ceil(total / pageSizeNumber),
      total: total,
    };
  }

  @Post()
  createuser(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
