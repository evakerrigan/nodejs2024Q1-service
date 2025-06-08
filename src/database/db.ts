import { Album } from 'src/album/album.service';
import { Artist } from 'src/artist/artist.service';
import { Favorites } from 'src/favorite/favorite.service';
import { Track } from 'src/track/track.service';
import { User } from 'src/user/user.service';

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
