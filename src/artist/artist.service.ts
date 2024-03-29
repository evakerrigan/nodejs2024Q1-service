import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
// import { Artist as PrismaArtist } from '@prisma/client';
import { CreateArtistDto } from './create-artist.dto';
// import { albums, artists, tracks } from 'src/database/db';
import { PrismaService } from 'src/prisma/prisma.service';

export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  // private prisma: PrismaClient;

  // constructor() {
  //   this.prisma = new PrismaClient();
  // }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    if (!createArtistDto.name || !createArtistDto.grammy) {
      throw new HttpException(
        'Name, year are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newArtist = await this.prisma.artist.create({
      data: {
        ...createArtistDto,
        id: uuidv4(),
      },
    });
    return newArtist;
  }

  async update(id: string, updateArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    if (
      typeof updateArtistDto.name !== 'string' ||
      typeof updateArtistDto.grammy !== 'boolean'
    ) {
      throw new HttpException(
        'Name, year are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
    // const updatedArtist: Artist = {
    //   ...artists[index],
    //   ...updateArtistDto,
    // };
    // artists[index] = updatedArtist;
    return updatedArtist;
  }

  async remove(id: string): Promise<boolean> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    // const index = artists.findIndex((artist) => artist.id === id);
    // if (index === -1) {
    //   return false;
    // }
    // tracks.forEach((track) => {
    //   if (track.artistId === id) {
    //     track.artistId = null;
    //   }
    // });
    // albums.forEach((album) => {
    //   if (album.artistId === id) {
    //     album.artistId = null;
    //   }
    // });
    await this.prisma.artist.delete({
      where: { id },
    });
    // artists.splice(index, 1);
    return true;
  }
}
