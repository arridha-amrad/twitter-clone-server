import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { TValidateUser } from './auth.dto';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { TAccessTokenPayload } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    data: TValidateUser,
  ): Promise<Omit<User, 'password'> | null> {
    const { identity, password } = data;

    let user: User | null;

    try {
      if (identity.includes('@')) {
        user = await this.userService.findOneByEmail(identity);
      } else {
        user = await this.userService.findOneByUsername(identity);
      }
      if (!user) return null;
      const isMatch = await verify(user.password, password);
      if (!isMatch) {
        throw new BadRequestException('Invalid password');
      }
      const { password: pwd, ...rest } = user;
      return rest;
    } catch (error) {
      throw error;
    }
  }

  createAccessToken(user: Omit<User, 'password'>) {
    try {
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '60s' });
      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  createRefreshToken(tokenId: string, user: Omit<User, 'password'>) {
    try {
      return this.jwtService.sign(
        { username: user.username, sub: user.id },
        { expiresIn: '1y', jwtid: tokenId },
      );
    } catch (error) {
      throw error;
    }
  }
}
