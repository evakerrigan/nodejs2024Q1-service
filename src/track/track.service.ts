import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './create-track.dto';

export interface Track {
  id: string;
  name: string;
  artistId: string;
  albumId: string;
  duration: number;
}

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    return this.tracks.find((track) => track.id === id);
  }

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: CreateTrackDto): Track {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new Error('Track not found');
    }
    const updatedTrack: Track = {
      ...this.tracks[index],
      ...updateTrackDto,
    };
    this.tracks[index] = updatedTrack;
    return this.tracks[index];
  }

  remove(id: string): boolean {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      return false;
    }
    this.tracks.splice(index, 1);
    return true;
  }
}
