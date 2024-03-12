import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './create-track.dto';
import { tracks } from 'src/database/db';

export interface Track {
  id: string;
  name: string;
  artistId: string;
  albumId: string;
  duration: number;
}

@Injectable()
export class TrackService {
  findAll(): Track[] {
    return tracks;
  }

  findOne(id: string): Track {
    return tracks.find((track) => track.id === id);
  }

  create(createTrackDto: CreateTrackDto): Track {
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
    tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: CreateTrackDto): Track {
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
    const index = tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    const updatedTrack: Track = {
      ...tracks[index],
      ...updateTrackDto,
    };
    tracks[index] = updatedTrack;
    return tracks[index];
  }

  remove(id: string): boolean {
    const index = tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      return false;
    }
    tracks.splice(index, 1);
    return true;
  }
}
