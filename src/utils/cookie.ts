import { CookieOptions } from 'express';

export class Cookie {
  static refreshTokenCookie = 'refreshToken';

  static cookieOptions: CookieOptions = {
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  };
}
