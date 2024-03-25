import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { validate as uuidValidate } from 'uuid';
// import { users } from 'src/database/db';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async create(createUserDto: CreateUserDto): Promise<PrismaUser> {
    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        // id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        // version: 1,
      },
    });
    // users.push(newUser);
    return newUser;
  }

  async findAll(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<PrismaUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<PrismaUser> {
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
    // const index = users.findIndex((user) => user.id === id);
    // if (index === -1) {
    //   throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    // }
    // if (users[index].password !== updatePasswordDto.oldPassword) {
    //   throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    // }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updatePasswordDto,
        updatedAt: new Date(),
      },
    });
    return updatedUser;
    // const updatedUser: User = {
    //   ...users[index],
    //   password: updatePasswordDto.newPassword,
    //   updatedAt: Date.now(),
    //   version: users[index].version + 1,
    // };
    // users[index] = updatedUser;
    // return users[index];
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
    //   const index = users.findIndex((user) => user.id === id);
    //   if (index === -1) {
    //     throw new Error('User not found');
    //   }
    //   users.splice(index, 1);
  }
}
