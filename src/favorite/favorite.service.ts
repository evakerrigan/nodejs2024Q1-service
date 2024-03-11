import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/album/album.service';
import { Artist } from 'src/artist/artist.service';
import { albums, artists, tracks } from 'src/database/db';
import { Track } from 'src/track/track.service';
import { validate as uuidValidate } from 'uuid';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

@Injectable()
export class FavoriteService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  async findAll(): Promise<FavoritesResponse> {
    const foundArtists = await Promise.all(
      this.favorites.artists.map((id) => artists.find((a) => a.id === id)),
    );
    const foundAlbums = await Promise.all(
      this.favorites.albums.map((id) => albums.find((a) => a.id === id)),
    );
    const foundTracks = await Promise.all(
      this.favorites.tracks.map((id) => tracks.find((a) => a.id === id)),
    );

    return {
      artists: foundArtists.filter(Boolean),
      albums: foundAlbums.filter(Boolean),
      tracks: foundTracks.filter(Boolean),
    };
  }

  addTrack(id: string): void {
    if (!uuidValidate(id)) {
      throw new Error('Invalid UUID');
    }
    if (!tracks.some((t) => t.id === id)) {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favorites.tracks.push(id);
  }

  removeTrack(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new Error('Track not found');
    }
    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string): void {
    if (!uuidValidate(id)) {
      throw new Error('Invalid UUID');
    }
    if (!albums.some((t) => t.id === id)) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favorites.albums.push(id);
  }

  removeAlbum(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new Error('Album not found');
    }
    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string): void {
    if (!uuidValidate(id)) {
      throw new Error('Invalid UUID');
    }
    if (!artists.some((t) => t.id === id)) {
      throw new HttpException(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favorites.artists.push(id);
  }

  removeArtist(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new Error('Artist not found');
    }
    this.favorites.artists.splice(index, 1);
  }
}
