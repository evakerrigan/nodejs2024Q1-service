import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { Album as PrismaAlbum } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './create-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { albums, tracks } from 'src/database/db';

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  // private prisma: PrismaClient;

  // constructor() {
  //   this.prisma = new PrismaClient();
  // }

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new HttpException(
        'Name, year are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newAlbum = await this.prisma.album.create({
      data: {
        ...createAlbumDto,
        id: uuidv4(),
      },
    });
    return newAlbum;
  }

  async update(id: string, updateAlbumDto: CreateAlbumDto): Promise<Album> {
    if (
      typeof updateAlbumDto.name !== 'string' ||
      typeof updateAlbumDto.year !== 'number' ||
      (typeof updateAlbumDto.artistId !== 'string' &&
        updateAlbumDto.artistId !== null)
    ) {
      throw new HttpException(
        'Name and year are required for updating an album',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    // const index = albums.findIndex((album) => album.id === id);
    // if (index === -1) {
    //   throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    // }
    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: {
        ...updateAlbumDto,
      },
    });
    return updatedAlbum;
    // const updatedAlbum: Album = {
    //   ...albums[index],
    //   ...updateAlbumDto,
    // };
    // albums[index] = updatedAlbum;
    // return updatedAlbum;
  }

  async remove(id: string): Promise<boolean> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.album.delete({
      where: { id },
    });
    return true;
    // const index = albums.findIndex((album) => album.id === id);
    // if (index === -1) {
    //   return false;
    // }
    // tracks.forEach((track) => {
    //   if (track.albumId === id) {
    //     track.albumId = null;
    //   }
    // });
    // albums.splice(index, 1);
    // return true;
  }
}
