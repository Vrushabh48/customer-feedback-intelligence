// src/types/auth.ts
export interface JwtPayload {
  sub: string; // userId
  sid: string; // sessionId
  iat: number;
  exp: number;
}
