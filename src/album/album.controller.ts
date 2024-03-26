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
  async findAll(): Promise<Album[]> {
    // try {
    const albums = await this.albumService.findAll();
    if (!albums) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return albums;
    // } catch (error) {
    //   throw new HttpException(
    //     'Internal server error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Album> {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    // try {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
    // } catch (error) {
    //   throw new HttpException(
    //     'Internal server error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
    // const album = this.albumService.findOne(id);
    // if (!album) {
    //   throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    // }
    // return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    // try {
    const album = await this.albumService.create(createAlbumDto);
    return album;
    // } catch (error) {
    //   throw new HttpException(
    //     'Internal server error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: CreateAlbumDto,
  ): Promise<Album> {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    // try {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return await this.albumService.update(id, updateAlbumDto);
    // } catch (error) {
    //   throw new HttpException(
    //     'Internal server error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    // try {
    const isRemoved = await this.albumService.remove(id);
    if (!isRemoved) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    // } catch (error) {
    //   throw new HttpException(
    //     'Internal server error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }
}
