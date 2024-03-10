import { Injectable } from '@nestjs/common';
import { Album, AlbumService } from 'src/album/album.service';
import { Artist, ArtistService } from 'src/artist/artist.service';
import { Track, TrackService } from 'src/track/track.service';
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

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const artists = await Promise.all(
      this.favorites.artists.map((id) => this.artistService.findOne(id)),
    );
    const albums = await Promise.all(
      this.favorites.albums.map((id) => this.albumService.findOne(id)),
    );
    const tracks = await Promise.all(
      this.favorites.tracks.map((id) => this.trackService.findOne(id)),
    );

    return {
      artists,
      albums,
      tracks,
    };
  }

  addTrack(id: string): void {
    if (!uuidValidate(id)) {
      throw new Error('Invalid UUID');
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
