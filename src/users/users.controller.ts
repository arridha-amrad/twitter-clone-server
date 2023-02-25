import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { hash } from 'argon2';
import { UsersService } from './users.service';
import { TRegisterDTO } from './dto/register.dto';
import { User } from '.prisma/client';
import { Request } from 'express';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAll() {
    return this.userService.findAll();
  }

  @Post('/register')
  async register(@Body() data: TRegisterDTO): Promise<User> {
    const { email, username, password } = data;
    try {
      const isUsernameRegistered = await this.userService.findOneByUsername(
        username,
      );

      if (isUsernameRegistered) {
        throw new BadRequestException('Username has been registered');
      }

      const isEmailRegistered = await this.userService.findOneByEmail(email);

      if (isEmailRegistered) {
        throw new BadRequestException('Email has been registered');
      }

      const hashedPassword = await hash(password);
      return this.userService.create({ ...data, password: hashedPassword });
    } catch (error) {
      throw error;
    }
  }
}
