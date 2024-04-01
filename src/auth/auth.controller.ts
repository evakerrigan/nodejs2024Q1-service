import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Auth, AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './auth.decorators';
import { User } from 'src/user/user.service';
import { RefreshDto } from './refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  async signup(@Body() authDto: AuthDto): Promise<User> {
    return await this.authService.signup(authDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto): Promise<Auth> {
    return await this.authService.login(authDto);
  }

  @Post('refresh')
  @UseGuards(AuthGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: RefreshDto): Promise<Auth> {
    return await this.authService.refresh(refreshDto);
  }
}
