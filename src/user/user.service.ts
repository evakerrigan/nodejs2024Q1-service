import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { validate as uuidValidate } from 'uuid';
import { PrismaClient } from '@prisma/client';

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
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: createUserDto,
    });
    return {
      ...newUser,
      createdAt: new Date(newUser.createdAt).getTime(),
      updatedAt: new Date(newUser.updatedAt).getTime(),
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => {
      return {
        ...user,
        createdAt: new Date(user.createdAt).getTime(),
        updatedAt: new Date(user.updatedAt).getTime(),
      };
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
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
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (updatePasswordDto.oldPassword !== user.password) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: { increment: 1 },
      },
    });
    return {
      ...updatedUser,
      createdAt: new Date(updatedUser.createdAt).getTime(),
      updatedAt: new Date(updatedUser.updatedAt).getTime(),
    };
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.user.delete({ where: { id } });
  }
}
