export class OAuthException extends Error {
  error: string;
  error_description?: string;
  error_uri?: string;
  state?: any;
}
