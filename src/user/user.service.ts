import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

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

  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    console.log('create user = ', user);
    const newUser: User = {
      ...user,
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

  update(id: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    console.log('update user = ', id, user);
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    const updatedUser: User = {
      ...user,
      id: this.users[index].id,
      createdAt: this.users[index].createdAt,
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
