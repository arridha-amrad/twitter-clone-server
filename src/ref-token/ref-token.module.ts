import { Module } from '@nestjs/common';
import { RefTokenService } from './ref-token.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  exports: [RefTokenService],
  providers: [RefTokenService, PrismaService],
})
export class RefTokenModule {}
