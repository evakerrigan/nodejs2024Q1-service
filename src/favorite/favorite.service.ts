import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany({ select: { artist: true } }),
      this.prisma.favoriteAlbum.findMany({ select: { album: true } }),
      this.prisma.favoriteTrack.findMany({ select: { track: true } }),
    ]);

    return {
      artists: artists.map(({ artist }) => artist),
      albums: albums.map(({ album }) => album),
      tracks: tracks.map(({ track }) => track),
    };
  }

  async addArtistToFavorites(id: string) {
    try {
      await this.prisma.favoriteArtist.create({ data: { artistId: id } });
    } catch {
      throw new HttpException(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async addAlbumToFavorites(id: string) {
    try {
      await this.prisma.favoriteAlbum.create({ data: { albumId: id } });
    } catch {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async addTrackToFavorites(id: string) {
    try {
      await this.prisma.favoriteTrack.create({
        data: { trackId: id },
      });
    } catch {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async removeArtistFromFavorites(id: string) {
    try {
      await this.prisma.favoriteArtist.delete({ where: { artistId: id } });
    } catch {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
  }

  async removeAlbumFromFavorites(id: string) {
    try {
      await this.prisma.favoriteAlbum.delete({ where: { albumId: id } });
    } catch {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
  }

  async removeTrackFromFavorites(id: string) {
    try {
      await this.prisma.favoriteTrack.delete({ where: { trackId: id } });
    } catch {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
  }
}
