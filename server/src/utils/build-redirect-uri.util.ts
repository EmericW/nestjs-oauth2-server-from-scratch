export const buildRedirectUri = (
  redirectUri: string,
  params: Record<string, string | undefined>,
): string => {
  const parsedRedirectUri = new URL(redirectUri);
  const targetQuery = new URLSearchParams(parsedRedirectUri.searchParams);

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value) {
      targetQuery.append(key, value);
    }
  });

  return `${parsedRedirectUri.origin}${
    parsedRedirectUri.pathname
  }?${targetQuery.toString()}`;
};
