import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from './prisma.service';
import { Client, ClientType } from '@prisma/client';
import * as z from 'zod';
import { UnauthorizedClientException } from 'src/exceptions/unauthorized-client.exception';
import oauthConfig from 'src/oauth.config';
import { Request } from 'express';

const registerClientSchema = z.object({
  redirectUrls: z.array(z.string().url()),
  type: z.nativeEnum(ClientType),
});

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async validateClientCredentials(
    request: Request,
  ): Promise<Client | undefined> {
    const { authorization } = request.headers;
    if (!authorization) {
      return undefined;
    }

    const result = authorization.match(/^Basic ([^\s].*)$/);
    if (null === result) {
      return undefined;
    }

    const token = result[1];
    const [clientId, clientSecret] = Buffer.from(token, 'base64')
      .toString()
      .split(':');

    const client = await this.prisma.client.findFirst({
      where: {
        id: clientId,
      },
    });

    if (!client) {
      throw new UnauthorizedClientException();
    }

    const doesSecretMatch = await bcrypt.compare(clientSecret, client.secret);
    if (false === doesSecretMatch) {
      throw new UnauthorizedClientException();
    }

    return client;
  }

  async registerClient(data: z.input<typeof registerClientSchema>) {
    const parsed = registerClientSchema.parse(data);

    const { arePublicClientsAllowed } = oauthConfig;

    if (
      false === arePublicClientsAllowed &&
      parsed.type === ClientType.PUBLIC
    ) {
      throw new Error('Public clients are not allowed');
    }

    let secret: string | undefined = undefined;
    let hashedSecret: string | undefined = undefined;
    if (data.type === ClientType.CONFIDENTIAL) {
      secret = crypto.randomBytes(20).toString('hex');
      hashedSecret = await bcrypt.hash(secret, 10);
    }

    const client = await this.prisma.client.create({
      data: {
        ...parsed,
        secret: hashedSecret,
      },
    });

    return { client, secret };
  }
}
