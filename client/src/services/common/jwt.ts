export type JwtPayload = {
  [key: string]: any;
  // Registered Claim Names
  iss?: string; // Issuer
  sub?: string; // Subject
  aud?: string[] | string; // Audience
  exp?: number; // Expiration Time (unix)
  nbf?: number; // Not Before (unix)
  iat?: number; // Issued At (unix)
  jti?: string; // JWT ID
}

export const decodeJwt = (token?: string): JwtPayload | undefined => {
  if (token === undefined) return undefined;

  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window.atob(base64).split('').map(
      c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  );
  return JSON.parse(jsonPayload);
};

export const getExpirationDate = (token?: JwtPayload): Date | undefined => {
  return token?.exp !== undefined ? new Date(token.exp * 1000) : undefined;
};

export const isTokenValid = (token: JwtPayload | undefined, marginSeconds: number) =>
  token?.exp !== undefined
    ? (token.exp - marginSeconds) * 1000 > new Date().getTime()
    : false;
