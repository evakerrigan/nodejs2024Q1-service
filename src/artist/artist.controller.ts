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
  findAll(): Artist[] {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Artist {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  @Post()
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ): Artist {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    try {
      return this.artistService.update(id, updateArtistDto);
    } catch (error) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    const isRemoved = this.artistService.remove(id);
    if (!isRemoved) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
  }
}
