interface OAuthConfig {
  shouldIssueRefreshTokens: boolean;
  arePublicClientsAllowed: boolean;
}

const config: OAuthConfig = {
  shouldIssueRefreshTokens: true,
  arePublicClientsAllowed: true,
};

export default config;
