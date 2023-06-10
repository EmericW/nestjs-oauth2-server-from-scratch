import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { OAuthException } from 'src/exceptions/oauth-exception.interface';

@Catch(OAuthException)
export class OAuthExceptionFilter implements ExceptionFilter {
  catch(exception: OAuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const status = exception.getStatus();

    response.status(400).json({
      error: exception.error,
      error_description: exception.error_description,
      error_uri: exception.error_uri,
      state: exception.state,
    });
  }
}
