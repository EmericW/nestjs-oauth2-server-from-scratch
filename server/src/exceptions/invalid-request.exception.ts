import { OAuthException } from './oauth-exception.interface';

export class InvalidRequestException extends OAuthException {
  public error = 'invalid_request';
}
