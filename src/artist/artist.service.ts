import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './create-artist.dto';
import { db } from 'src/database/db';

export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

@Injectable()
export class ArtistService {
  findAll(): Artist[] {
    return db.artists;
  }

  findOne(id: string): Artist {
    return db.artists.find((artist) => artist.id === id);
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
    db.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: CreateArtistDto): Artist {
    const index = db.artists.findIndex((artist) => artist.id === id);
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
      ...db.artists[index],
      ...updateArtistDto,
    };
    db.artists[index] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): boolean {
    const index = db.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      return false;
    }
    db.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    db.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    db.artists.splice(index, 1);
    return true;
  }
}
