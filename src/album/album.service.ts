import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './create-album.dto';
import { albums, tracks } from 'src/database/db';

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

@Injectable()
export class AlbumService {
  findAll(): Album[] {
    return albums;
  }

  findOne(id: string): Album {
    return albums.find((album) => album.id === id);
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
    albums.push(newAlbum);
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
    const index = albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    const updatedAlbum: Album = {
      ...albums[index],
      ...updateAlbumDto,
    };
    albums[index] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string): boolean {
    const index = albums.findIndex((album) => album.id === id);
    if (index === -1) {
      return false;
    }
    tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    albums.splice(index, 1);
    return true;
  }
}
