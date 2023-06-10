import { Controller, Post, Req } from '@nestjs/common';
import * as z from 'zod';
import { Request } from 'express';
import { ClientService } from 'src/services/client.service';
import { assert } from 'src/utils/assert.util';
import { UnauthorizedClientException } from 'src/exceptions/unauthorized-client.exception';
import { AuthorizationCodeService } from 'src/services/authorization-code.service';
import { AccessDeniedException } from 'src/exceptions/access-denied.exception';
import { AccessTokenService } from 'src/services/access-token.service';

const tokenBodySchema = z.object({
  grant_type: z.literal('authorization_code'),
  code: z.string(),
  redirect_uri: z.string().optional(),
  client_id: z.string(),
});

@Controller()
export class TokenController {
  constructor(
    private readonly clientService: ClientService,
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  @Post('/oauth/token')
  async token(@Req() request: Request) {
    const { client_id, code } = assert({
      schema: tokenBodySchema,
      data: request.body,
    });

    let client = await this.clientService.findClientById(client_id);
    if (client.type === 'CONFIDENTIAL') {
      client = await this.clientService.assertClientCredentials(request);
      // Make sure the authorized client matches the provided `client_id`
      if (client.id !== client_id) {
        throw new UnauthorizedClientException();
      }
    }

    const authorizationCode = await this.authorizationCodeService.findByCode({
      code,
    });

    if (!authorizationCode) {
      throw new AccessDeniedException();
    }

    if (authorizationCode.clientId !== client.id) {
      throw new UnauthorizedClientException();
    }

    if (authorizationCode.expiresAt.getTime() < Date.now()) {
      throw new AccessDeniedException();
    }

    return this.accessTokenService.issueAccessToken({ client });
  }
}
