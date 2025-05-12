import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { addSeconds } from 'date-fns';
import { CookieOptions, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { secureCookieOptions } from './cookie-options';
import { AppConfig } from 'config';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtCore: JwtService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async addJTIToBlacklist(jti: string, exp: number) {
    await this.cache.set(
      `blacklist_${jti}`,
      exp,
      AppConfig.JWT_EXPIRATION_TIME, // keep in the blacklist before the jwt expired
    );
  }

  async isJTIBlacklisted(jti: string): Promise<boolean> {
    const value = await this.cache.get(`blacklist_${jti}`);
    // console.log(`>> blacklist_${jti}: `, value)
    return !!value;
  }

  async setJWTInAuthHeaders(token: string, res: Response) {
    res.setHeader('Authorization', `Bearer ${token}`);
    res.setHeader('x-access-token', token);
  }

  async setJWTInCookie(
    name: string,
    value: string,
    options: CookieOptions,
    res: Response,
  ) {
    res.cookie(name, value, options);
  }

  async getJWTWithCookieOptions(id: string) {
    // JWT registered claims: https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims
    // in order to invalidate a jwt, the jti will be blacklisted in the format of `blacklist_${jti}` when user logout
    const payload = {
      sub: id, // sub (subject): Subject of the JWT (the user id)
      jti: uuidv4() as string, // jti (JWT ID): Unique identifier
    };
    const token = await this.jwtCore.signAsync(payload);
    return {
      name: AppConfig.TOKEN_KEY,
      value: token,
      options: <CookieOptions>{
        ...secureCookieOptions,
        expires: addSeconds(new Date(), AppConfig.JWT_EXPIRATION_TIME),
      },
    };
  }

  async unsetJWT(res: Response) {
    const name = AppConfig.TOKEN_KEY;
    const options = {
      ...secureCookieOptions,
      maxAge: 0,
    } as CookieOptions;
    res.clearCookie(name, options);
    res.removeHeader('Authorization');
    res.removeHeader('x-access-token');
  }
}
