import cookieService from './common/cookie';
import {decodeJwt, getExpirationDate, isTokenValid} from './common/jwt';
import {post} from './common/jsonHttp';
import {API_BASE_URL} from '../config';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';
const JWT_EXPIRATION_MARGIN = 30; // seconds

type RefreshTokenRequest = { refresh: string };
type RefreshTokenResponse = { access: string };
type LoginRequest = { email: string, password: string };
type LoginResponse = { access: string, refresh: string };

let jwtRefreshTimeoutId: number | undefined = undefined;

export class CannotRefreshTokenError extends Error {
  constructor() {
    super('Cannot refresh token');
  }
}

const isValid = (token?: string) => isTokenValid(decodeJwt(token), JWT_EXPIRATION_MARGIN);
const isAccessTokenValid = () => isValid(cookieService.get(ACCESS_TOKEN_COOKIE));

const newAccessToken = (accessToken: string) => {
  const jwt = decodeJwt(accessToken);
  cookieService.set(ACCESS_TOKEN_COOKIE, accessToken, getExpirationDate(jwt));
  if (jwtRefreshTimeoutId !== undefined) {
    clearTimeout(jwtRefreshTimeoutId);
    jwtRefreshTimeoutId = undefined;
  }

  if (jwt?.exp) {
    // renew some seconds before expiring
    const timeout = Math.trunc(jwt?.exp - (new Date().getTime() / 1000)) - JWT_EXPIRATION_MARGIN;
    jwtRefreshTimeoutId = window.setTimeout(() => {
      refreshToken()
        .then(() => console.log('Token refreshed successfully.'))
        .catch(console.error);
    }, timeout * 1000);
  }
};

const refreshToken = async (): Promise<void> => {
  if (isAccessTokenValid()) {
    return;
  }

  const refreshToken = cookieService.get(REFRESH_TOKEN_COOKIE);
  if (refreshToken && isValid(refreshToken)) {
    const {access: accessToken} = await post<RefreshTokenRequest, RefreshTokenResponse>({
      baseUrl: API_BASE_URL,
      path: 'auth/jwt/refresh',
      body: {refresh: refreshToken}
    });
    newAccessToken(accessToken);
  }

  if (!isAccessTokenValid()) {
    throw new CannotRefreshTokenError();
  }
};

const login = async (email: string, password: string) => {
  const {access: accessToken, refresh: refreshToken} = await post<LoginRequest, LoginResponse>({
    baseUrl: API_BASE_URL,
    path: 'auth/jwt/create',
    body: {email, password}
  });

  cookieService.set(REFRESH_TOKEN_COOKIE, refreshToken, getExpirationDate(decodeJwt(refreshToken)));
  newAccessToken(accessToken);
};

const isLogged = async () => {
  await refreshToken();
  return isAccessTokenValid();
};

const getAccessToken = async () => {
  await refreshToken();
  return cookieService.get(ACCESS_TOKEN_COOKIE);
};

export default {
  isLogged,
  login,
  getAccessToken
};
