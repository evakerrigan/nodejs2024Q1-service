import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';

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
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    console.log('create user = ', createUserDto);
    const newUser: User = {
      ...createUserDto,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    console.log('findAll users = ', this.users);
    return this.users;
  }

  findOne(id: string): User {
    console.log('findOne user = ', id);
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): User {
    console.log('update user password = ', id, updatePasswordDto);
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    if (this.users[index].password !== updatePasswordDto.oldPassword) {
      throw new Error('Old password is incorrect');
    }
    const updatedUser: User = {
      ...this.users[index],
      password: updatePasswordDto.newPassword,
      updatedAt: Date.now(),
      version: this.users[index].version + 1,
    };
    this.users[index] = updatedUser;
    return this.users[index];
  }

  remove(id: string): void {
    console.log('remove user = ', id);
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users.splice(index, 1);
  }
}
