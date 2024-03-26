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
import { Artist, ArtistService } from './artist.service';
import { CreateArtistDto } from './create-artist.dto';
import { validate as uuidValidate } from 'uuid';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    try {
      const artists = await this.artistService.findAll();
      return artists;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Artist> {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    // try {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
    // } catch (error) {
    //   throw new HttpException(
    //     'Internal server error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    try {
      const artist = await this.artistService.create(createArtistDto);
      return artist;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    try {
      const artist = await this.artistService.update(id, updateArtistDto);
      return artist;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    // try {
    const isRemoved = await this.artistService.findOne(id);
    if (!isRemoved) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    await this.artistService.remove(id);
    // } catch (error) {
    //   throw new HttpException(
    //     'Internal server error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
    // const isRemoved = this.artistService.remove(id);
    // if (!isRemoved) {
    //   throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    // }
  }
}
