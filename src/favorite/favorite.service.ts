import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const artistsPromise = this.prisma.favoriteArtist.findMany({
      select: { artist: true },
    });
    const albumsPromise = this.prisma.favoriteAlbum.findMany({
      select: { album: true },
    });
    const tracksPromise = this.prisma.favoriteTrack.findMany({
      select: { track: true },
    });

    const [artists, albums, tracks] = await Promise.all([
      artistsPromise,
      albumsPromise,
      tracksPromise,
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
      throw new UnprocessableEntityException(`Artist not found`);
    }
  }

  async addAlbumToFavorites(id: string) {
    try {
      await this.prisma.favoriteAlbum.create({ data: { albumId: id } });
    } catch {
      throw new UnprocessableEntityException(`Album not found`);
    }
  }

  async addTrackToFavorites(id: string) {
    try {
      await this.prisma.favoriteTrack.create({
        data: { trackId: id },
      });
    } catch {
      throw new UnprocessableEntityException(`Track not found`);
    }
  }

  async removeArtistFromFavorites(id: string) {
    try {
      await this.prisma.favoriteArtist.delete({ where: { artistId: id } });
    } catch {
      throw new NotFoundException(`Artist not found`);
    }
  }

  async removeAlbumFromFavorites(id: string) {
    try {
      await this.prisma.favoriteAlbum.delete({ where: { albumId: id } });
    } catch {
      throw new NotFoundException(`Album not found`);
    }
  }

  async removeTrackFromFavorites(id: string) {
    try {
      await this.prisma.favoriteTrack.delete({ where: { trackId: id } });
    } catch {
      throw new NotFoundException(`Track not found`);
    }
  }
}
