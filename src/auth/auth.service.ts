import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';
import { RefreshDto } from './refresh.dto';
import * as bcrypt from 'bcrypt';

export interface Payload {
  userId: string;
  login: string;
}

export interface Auth {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async getTokens(payload: Payload): Promise<string[]> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY || 'secret123123',
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret123123',
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
    });

    return [accessToken, refreshToken];
  }

  async verifyAccessToken(token: string): Promise<Payload> {
    const { userId, login } = await this.jwtService.verifyAsync<Payload>(
      token,
      {
        secret: process.env.JWT_SECRET_KEY || 'secret123123',
      },
    );
    return { userId, login };
  }

  async verifyRefreshToken(token: string) {
    try {
      const { userId, login } = await this.jwtService.verifyAsync<Payload>(
        token,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret123123',
        },
      );
      const payload = { userId, login };
      return await this.getTokens(payload);
    } catch (error) {
      return null;
    }
  }

  async signup(authDto: AuthDto): Promise<User> {
    const isUserLoginExist = await this.userService.isLoginExist(authDto.login);

    if (isUserLoginExist) {
      throw new HttpException(
        'User login already exists',
        HttpStatus.FORBIDDEN,
      );
    }

    const hashedPassword = await bcrypt.hash(
      authDto.password,
      +process.env.CRYPT_SALT || 10,
    );

    return await this.userService.create({
      login: authDto.login,
      password: hashedPassword,
    });
  }

  async login(authDto: AuthDto): Promise<Auth> {
    const isUserValid = await this.userService.isUserValid(
      authDto.login,
      authDto.password,
    );

    if (!isUserValid)
      throw new HttpException('Wrong login or password', HttpStatus.FORBIDDEN);

    const user = await this.userService.findOneByLogin(authDto.login);
    const { id: userId, login } = user;

    const [accessToken, refreshToken] = await this.getTokens({
      userId,
      login,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshTokenDto: RefreshDto): Promise<Auth> {
    const token = refreshTokenDto.refreshToken;

    if (!token) {
      throw new HttpException('No refresh token', HttpStatus.UNAUTHORIZED);
    }

    try {
      const [accessToken, refreshToken] = await this.verifyRefreshToken(token);

      return {
        accessToken,
        refreshToken,
      };
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN);
    }
  }
}
