import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './create-album.dto';
import { db } from 'src/database/db-memory';

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

@Injectable()
export class AlbumService {
  findAll(): Album[] {
    return db.albums;
  }

  findOne(id: string): Album {
    return db.albums.find((album) => album.id === id);
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new HttpException(
        'Name, year are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    db.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: CreateAlbumDto): Album {
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
    const index = db.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    const updatedAlbum: Album = {
      ...db.albums[index],
      ...updateAlbumDto,
    };
    db.albums[index] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string): boolean {
    const index = db.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      return false;
    }
    db.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    db.albums.splice(index, 1);
    return true;
  }
}
