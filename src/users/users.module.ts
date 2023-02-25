import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
