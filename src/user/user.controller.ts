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
  @HttpCode(HttpStatus.CREATED)
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
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
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
    await this.userService.remove(id);
  }
}
