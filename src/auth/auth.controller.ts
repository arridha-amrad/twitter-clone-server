import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { AccessGuard } from './access.guard';
import { RefTokenService } from 'src/ref-token/ref-token.service';
import { TAccessTokenPayload } from './auth.type';
import { UsersService } from 'src/users/users.service';
import { Cookie } from 'src/utils/cookie';
import { RefTokenGuard } from 'src/ref-token/ref-token.guard';
import { TRefTokenPayload } from 'src/ref-token/ref-token.type';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private refTokenService: RefTokenService,
    private userService: UsersService,
  ) {}

  @UseGuards(RefTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refTokenPayload = req.app.locals.refTokenPayload as TRefTokenPayload;
    try {
      await this.refTokenService.delete(refTokenPayload.jti);
      req.headers.authorization = '';
      res.clearCookie(Cookie.refreshTokenCookie, Cookie.cookieOptions);
      return res.status(200).send('logout gracefully');
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(RefTokenGuard)
  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const payload = req.app.locals.refTokenPayload as TRefTokenPayload;
      const storedToken = await this.refTokenService.find(payload.jti);

      if (!storedToken)
        throw new InternalServerErrorException('token not found');

      const storedUser = await this.userService.findOneByUsername(
        payload.username,
      );

      if (!storedUser) throw new NotFoundException('User not found');

      const newAccToken = this.authService.createAccessToken(storedUser);
      const newReftoken = this.authService.createRefreshToken(
        storedToken.id,
        storedUser,
      );

      await this.refTokenService.update({
        id: storedToken.id,
        value: newReftoken,
      });

      res.cookie(
        Cookie.refreshTokenCookie,
        `Bearer ${newReftoken}`,
        Cookie.cookieOptions,
      );

      return res.status(200).json({ accessToken: newAccToken });
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AccessGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    try {
      const loginUser = req.user as TAccessTokenPayload;
      const storedUser = await this.userService.findById(loginUser.sub);
      if (!storedUser) throw new NotFoundException('User not found');
      const { password, ...rest } = storedUser;
      return rest;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.user) throw new UnauthorizedException();
      const user = req.user as Omit<User, 'password'>;
      const accessToken = this.authService.createAccessToken(user);

      const storedToken = await this.refTokenService.create({
        token: '',
        userId: user.id,
      });

      const refreshToken = this.authService.createRefreshToken(
        storedToken.id,
        user,
      );

      await this.refTokenService.update({
        id: storedToken.id,
        value: refreshToken,
      });

      res.cookie(
        Cookie.refreshTokenCookie,
        `Bearer ${refreshToken}`,
        Cookie.cookieOptions,
      );
      return res.status(200).json({ user, accessToken });
    } catch (error) {
      throw error;
    }
  }
}
