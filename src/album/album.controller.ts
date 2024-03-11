import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { Album, AlbumService } from './album.service';
import { CreateAlbumDto } from './create-album.dto';
import { validate as uuidValidate } from 'uuid';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Album[] {
    return this.albumService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Album {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const album = this.albumService.findOne(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    if (
      !createAlbumDto.name ||
      !createAlbumDto.year ||
      !createAlbumDto.artistId
    ) {
      throw new HttpException(
        'Name, year and artistId is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: CreateAlbumDto,
  ): Album {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    try {
      const updatedAlbum = this.albumService.update(id, updateAlbumDto);
      return updatedAlbum;
    } catch (error) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const isRemoved = this.albumService.remove(id);
    if (!isRemoved) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
  }
}
