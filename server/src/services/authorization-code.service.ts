import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from './prisma.service';
import { Client } from '@prisma/client';

@Injectable()
export class AuthorizationCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ client }: { client: Client }) {
    const value = crypto.randomBytes(20).toString('hex');

    const code = await this.prisma.authorizationCode.create({
      data: {
        clientId: client.id,
        value,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      },
    });

    return code;
  }

  async findByCode({ code }: { code: string }) {
    return this.prisma.authorizationCode.findFirst({
      where: {
        value: code,
      },
    });
  }
}
