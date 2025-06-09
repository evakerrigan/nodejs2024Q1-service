import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { validate as uuidValidate } from 'uuid';
import { Database } from 'src/database/db-postgres';

export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

interface UserInDb {
  id: string;
  login: string;
  password: string;
  version: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class UserService {
  constructor(private readonly db: Database) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = new Date();
    const newUser: UserInDb = {
      ...createUserDto,
      id: uuidv4(),
      created_at: now,
      updated_at: now,
      version: 1,
    };
    
    const createdUser = await this.db.create<UserInDb>('users', newUser);
    return {
      id: createdUser.id,
      login: createdUser.login,
      password: createdUser.password,
      version: createdUser.version,
      createdAt: createdUser.created_at.getTime(),
      updatedAt: createdUser.updated_at.getTime(),
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.db.findAll<UserInDb>('users');
    return users.map(user => ({
      id: user.id,
      login: user.login,
      password: user.password,
      version: user.version,
      createdAt: user.created_at.getTime(),
      updatedAt: user.updated_at.getTime(),
    }));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.db.findOne<UserInDb>('users', id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      id: user.id,
      login: user.login,
      password: user.password,
      version: user.version,
      createdAt: user.created_at.getTime(),
      updatedAt: user.updated_at.getTime(),
    };
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto): Promise<User> {
    // Проверка типов паролей
    if (
      typeof updatePasswordDto.newPassword !== 'string' ||
      typeof updatePasswordDto.oldPassword !== 'string'
    ) {
      throw new HttpException(
        'New password and old password are required for updating a password',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Проверка валидности UUID
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }

    // Получение пользователя
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Проверка старого пароля
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }

    // Обновление пользователя
    const updatedUser = await this.db.update<UserInDb>('users', id, {
      password: updatePasswordDto.newPassword,
      updated_at: new Date(),
      version: user.version + 1,
    });

    return {
      id: updatedUser.id,
      login: updatedUser.login,
      password: updatedUser.password,
      version: updatedUser.version,
      createdAt: updatedUser.created_at.getTime(),
      updatedAt: updatedUser.updated_at.getTime(),
    };
  }

  async remove(id: string): Promise<void> {
    await this.db.delete('users', id);
  }
}
