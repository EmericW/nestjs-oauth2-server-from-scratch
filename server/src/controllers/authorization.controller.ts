import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import * as z from 'zod';
import { Request, Response } from 'express';
import { UnsupportedResponseTypeException } from 'src/exceptions/unsupported-response-type.exception';
import { ClientService } from 'src/services/client.service';
import { compareUris } from 'src/utils/compare-uris.util';
import { UserService } from 'src/services/user.service';
import { AuthorizationCodeService } from 'src/services/authorization-code.service';
import { AccessDeniedException } from 'src/exceptions/access-denied.exception';
import { assert } from 'src/utils/assert.util';
import { buildRedirectUri } from 'src/utils/build-redirect-uri.util';

const responseTypeSchema = z.enum(['code', 'token']);

const codeGrantTypeQuerySchema = z.object({
  response_type: z.literal('code'),
  client_id: z.string(),
  redirect_uri: z.string(), //.optional(), todo: make optional
  scope: z.string().optional(),
  state: z.string().optional(),
});

const tokenGrantTypeQuerySchema = z.object({
  response_type: z.literal('token'),
});

const authorizationQuerySchema = z.discriminatedUnion('response_type', [
  codeGrantTypeQuerySchema,
  tokenGrantTypeQuerySchema,
]);

const authorizationBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

@Controller()
export class AuthorizationController {
  constructor(
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly authorizationCodeService: AuthorizationCodeService,
  ) {}

  @Get('/oauth/authorization')
  async authorizationGet(@Req() request: Request, @Res() response: Response) {
    assert({
      schema: responseTypeSchema,
      data: request.query.response_type,
      errorToThrow: UnsupportedResponseTypeException,
    });
    const query = assert({
      schema: authorizationQuerySchema,
      data: request.query,
    });

    const { response_type } = query;
    if (response_type === 'code') {
      const { redirect_uri, client_id } = query;

      const client = await this.clientService.findClientById(client_id);

      let isRedirectUriValid = false;
      client.redirectUrls.forEach((uri) => {
        const result = compareUris(uri, redirect_uri);
        if (result === true) {
          isRedirectUriValid = true;
        }
      });

      return this.respondWithAuthorizationForm({
        request,
        response,
        error: isRedirectUriValid ? undefined : 'Invalid redirect URI provided',
      });
    } else if (response_type === 'token') {
      // @todo: implement
    }
  }

  private respondWithAuthorizationForm({
    response,
    request,
    error,
  }: {
    response: Response;
    request: Request;
    error?: string;
  }) {
    return response.render('authorization', {
      url: request.url,
      error,
    });
  }

  @Post('/oauth/authorization')
  async authorizationPost(@Req() request: Request, @Res() response: Response) {
    const result = authorizationBodySchema.safeParse(request.body);
    const query = assert({
      schema: codeGrantTypeQuerySchema,
      data: request.query,
    });

    if (!result.success) {
      return this.respondWithAuthorizationForm({
        request,
        response,
        error: '',
      });
    }

    const { data: body } = result;
    const { client_id, redirect_uri, state } = query;

    try {
      const client = await this.clientService.findClientById(
        client_id as string,
      );

      const { username, password } = body;

      await this.userService.validateUserCredentials({
        username,
        password,
      });
      const code = await this.authorizationCodeService.create({ client });

      response.redirect(
        buildRedirectUri(redirect_uri, {
          code: code.value,
          state: state,
        }),
      );
    } catch (error: any) {
      if (false === error instanceof AccessDeniedException) {
        throw error;
      }

      return this.respondWithAuthorizationForm({
        request,
        response,
        error: 'Invalid credentials provided',
      });
    }
  }
}
