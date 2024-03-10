import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './create-artist.dto';

export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    return this.artists.find((artist) => artist.id === id);
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: CreateArtistDto): Artist {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new Error('Artist not found');
    }
    const updatedArtist: Artist = {
      ...this.artists[index],
      ...updateArtistDto,
    };
    this.artists[index] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): boolean {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      return false;
    }
    this.artists.splice(index, 1);
    return true;
  }
}
