import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './create-album.dto';

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    return this.albums.find((album) => album.id === id);
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: CreateAlbumDto): Album {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new Error('Album not found');
    }
    const updatedAlbum: Album = {
      ...this.albums[index],
      ...updateAlbumDto,
    };
    this.albums[index] = updatedAlbum;
    return this.albums[index];
  }

  remove(id: string): boolean {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      return false;
    }
    this.albums.splice(index, 1);
    return true;
  }
}
