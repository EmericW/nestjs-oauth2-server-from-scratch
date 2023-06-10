import { OAuthException } from './oauth-exception.interface';

export class AccessDeniedException extends OAuthException {
  public error = 'access_denied';
}
