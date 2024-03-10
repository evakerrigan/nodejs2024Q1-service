import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { validate as uuidValidate } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    if (!createUserDto.login) {
      throw new HttpException('Login is required', HttpStatus.BAD_REQUEST);
    }
    if (!createUserDto.password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const user = this.userService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Put(':id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): User {
    if (!uuidValidate(id)) {
      throw new HttpException(
        'updatePassword - Invalid UUID',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updatedUser = this.userService.update(id, updatePasswordDto);
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      if (error.message === 'Old password is incorrect') {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const user = this.userService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.userService.remove(id);
  }
}
