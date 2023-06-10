import { OAuthException } from './oauth-exception.interface';

export class InvalidScopeException extends OAuthException {
  public error = 'invalid_scope';
}
