import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.favoriteService.findAll();
  }

  @Post('/artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtistToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoriteService.addArtistToFavorites(id);
  }

  @Post('/album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbumToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoriteService.addAlbumToFavorites(id);
  }

  @Post('/track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrackToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoriteService.addTrackToFavorites(id);
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.favoriteService.removeArtistFromFavorites(id);
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoriteService.removeAlbumFromFavorites(id);
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favoriteService.removeTrackFromFavorites(id);
  }
}
