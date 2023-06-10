import { OAuthException } from './oauth-exception.interface';

export class UnauthorizedClientException extends OAuthException {
  public error = 'unauthorized_client';
}
