import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TPutRefToke, TSaveRefToken } from './ref-token.type';

@Injectable()
export class RefTokenService {
  constructor(private prisma: PrismaService) {}

  async create(data: TSaveRefToken) {
    const { token, userId } = data;
    return this.prisma.token.create({
      data: {
        value: token,
        userId,
      },
    });
  }

  async find(id: string) {
    return this.prisma.token.findFirst({
      where: {
        id,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.token.delete({
      where: {
        id,
      },
    });
  }

  async update(data: TPutRefToke) {
    const { id, value } = data;
    return this.prisma.token.update({
      data: {
        value,
      },
      where: {
        id,
      },
    });
  }
}
