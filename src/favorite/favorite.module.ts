import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  providers: [FavoriteService, ArtistService, AlbumService, TrackService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
