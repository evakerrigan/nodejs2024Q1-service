import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './create-track.dto';
import { PrismaClient, Track as PrismaTrack } from '@prisma/client';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { tracks } from 'src/database/db';

export interface Track {
  id: string;
  name: string;
  artistId: string;
  albumId: string;
  duration: number;
}

@Injectable()
export class TrackService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async findAll(): Promise<PrismaTrack[]> {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<PrismaTrack | null> {
    return await this.prisma.track.findUnique({
      where: { id },
    });
  }

  async create(createTrackDto: CreateTrackDto): Promise<PrismaTrack> {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    return await this.prisma.track.create({
      data: newTrack,
    });
  }

  async update(
    id: string,
    updateTrackDto: CreateTrackDto,
  ): Promise<PrismaTrack> {
    if (
      typeof updateTrackDto.name !== 'string' ||
      typeof updateTrackDto.duration !== 'number' ||
      (typeof updateTrackDto.artistId !== 'string' &&
        updateTrackDto.artistId !== null) ||
      (typeof updateTrackDto.albumId !== 'string' &&
        updateTrackDto.albumId !== null)
    ) {
      throw new HttpException(
        'Name and duration are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return track;
    // const index = tracks.findIndex((track) => track.id === id);
    // if (index === -1) {
    //   throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    // }
    // const updatedTrack: Track = {
    //   ...tracks[index],
    //   ...updateTrackDto,
    // };
    // tracks[index] = updatedTrack;
    // return tracks[index];
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.prisma.track.delete({
      where: { id },
    });

    return !!result;
    // const index = tracks.findIndex((track) => track.id === id);
    // if (index === -1) {
    //   return false;
    // }
    // tracks.splice(index, 1);
    // return true;
  }
}
