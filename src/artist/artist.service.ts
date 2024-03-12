import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './create-artist.dto';
import { albums, artists, tracks } from 'src/database/db';

export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

@Injectable()
export class ArtistService {
  findAll(): Artist[] {
    return artists;
  }

  findOne(id: string): Artist {
    return artists.find((artist) => artist.id === id);
  }

  create(createArtistDto: CreateArtistDto): Artist {
    if (!createArtistDto.name || !createArtistDto.grammy) {
      throw new HttpException(
        'Name, year are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: CreateArtistDto): Artist {
    const index = artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
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
    const updatedArtist: Artist = {
      ...artists[index],
      ...updateArtistDto,
    };
    artists[index] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): boolean {
    const index = artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      return false;
    }
    tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    artists.splice(index, 1);
    return true;
  }
}
