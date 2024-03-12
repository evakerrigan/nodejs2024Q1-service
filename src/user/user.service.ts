import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { validate as uuidValidate } from 'uuid';
import { users } from 'src/database/db';

export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      ...createUserDto,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };
    users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return users;
  }

  findOne(id: string): User {
    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): User {
    if (
      typeof updatePasswordDto.newPassword !== 'string' ||
      typeof updatePasswordDto.oldPassword !== 'string'
    ) {
      throw new HttpException(
        'New password and old password are required for updating a password',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (users[index].password !== updatePasswordDto.oldPassword) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }
    const updatedUser: User = {
      ...users[index],
      password: updatePasswordDto.newPassword,
      updatedAt: Date.now(),
      version: users[index].version + 1,
    };
    users[index] = updatedUser;
    return users[index];
  }

  remove(id: string): void {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    users.splice(index, 1);
  }
}
