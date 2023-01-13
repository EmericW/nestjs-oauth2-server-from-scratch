import { OAuthException } from './oauth-exception.interface';

export class UnauthorizedClientException
  extends Error
  implements OAuthException
{
  public error = 'unauthorized_client';
}
