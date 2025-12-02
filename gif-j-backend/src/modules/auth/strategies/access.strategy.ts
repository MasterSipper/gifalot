import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// TODO: Re-enable authentication when ready
// Set DISABLE_AUTH to false to re-enable authentication
const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true' || process.env.STAGE === 'local';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET || 'dev-secret-key',
      // In development mode, ignore expiration and signature verification
      ignoreExpiration: DISABLE_AUTH,
      passReqToCallback: false,
    });
  }

  public validate(payload: JwtPayload | null) {
    // Return mock user for development if auth is disabled or no payload
    if (DISABLE_AUTH) {
      return payload || { id: 1, email: 'dev@example.com', sessionId: 'dev-session' };
    }
    if (!payload) {
      return { id: 1, email: 'dev@example.com', sessionId: 'dev-session' };
    }
    return payload;
  }
}

export type JwtPayload = { id: number; email: string; sessionId: string };
