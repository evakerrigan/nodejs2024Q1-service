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
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    if (!createUserDto.login) {
      throw new HttpException('Login is required', HttpStatus.BAD_REQUEST);
    }
    if (!createUserDto.password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.create(createUserDto);
    const userWithoutPassword = Object.keys(user).reduce((acc, key) => {
      if (key !== 'password') {
        acc[key] = user[key];
      }
      return acc;
    }, {} as Partial<User>);
    return userWithoutPassword;
  }

  @Get()
  async findAll(): Promise<Partial<User>[]> {
    try {
      const users = await this.userService.findAll();
      return users.map((user) => {
        const userWithoutPassword = Object.keys(user).reduce((acc, key) => {
          if (key !== 'password') {
            acc[key] = user[key];
          }
          return acc;
        }, {} as Partial<User>);
        return userWithoutPassword;
      });
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.userService.findOne(id);
      return user;
    } catch (error) {
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.NOT_FOUND
      ) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Partial<User>> {
    const updatedUser = await this.userService.update(id, updatePasswordDto);
    const userWithoutPassword = Object.keys(updatedUser).reduce((acc, key) => {
      if (key !== 'password') {
        acc[key] = updatedUser[key];
      }
      return acc;
    }, {} as Partial<User>);
    return userWithoutPassword;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.userService.remove(id);
  }
}
