import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from './prisma.service';
import { Client } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

export interface AccessTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
}

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async issueAccessToken({
    client,
  }: {
    client: Client;
  }): Promise<AccessTokenResponse> {
    const accessToken = this.jwtService.sign({});
    const refreshToken = crypto.randomBytes(20).toString('hex');

    await this.prisma.refreshToken.create({
      data: {
        value: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
        clientId: client.id,
      },
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 0,
      refresh_token: refreshToken,
    };
  }
}
