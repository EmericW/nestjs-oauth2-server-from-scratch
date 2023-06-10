import { OAuthException } from './oauth-exception.interface';

export class UnsupportedResponseTypeException extends OAuthException {
  public error = 'unsupported_response_type';
}
