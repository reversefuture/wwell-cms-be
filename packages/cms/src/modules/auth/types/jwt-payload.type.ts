export type JwtPayload = {
  sub: string;
  jti: string;
  iat: number | string;
  exp: number | string;
};
