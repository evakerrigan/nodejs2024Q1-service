import { Album } from 'src/album/album.service';
import { Artist } from 'src/artist/artist.service';
import { Favorites } from 'src/favorite/favorite.service';
import { Track } from 'src/track/track.service';
import { User } from 'src/user/user.service';

export const users: User[] = [];
export const artists: Artist[] = [];
export const albums: Album[] = [];
export const tracks: Track[] = [];
export const favorites: Favorites[] = [];

interface Database {
  users: User[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  favorites: Favorites[];
}

export const db: Database = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
  favorites: [],
};
