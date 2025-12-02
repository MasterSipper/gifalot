import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// TODO: Re-enable authentication when ready
// Set DISABLE_AUTH to false to re-enable authentication checks
const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true' || process.env.STAGE === 'local';

export class OptionalJwtAccessAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    // Bypass authentication check if disabled
    if (DISABLE_AUTH) {
      return true;
    }
    return super.canActivate(context);
  }

  public handleRequest(err, user, info) {
    // Return mock user for development if auth is disabled
    if (DISABLE_AUTH) {
      return { id: 1, email: 'dev@example.com', sessionId: 'dev-session' };
    }
    if (info && info?.message !== 'No auth token') {
      throw new UnauthorizedException();
    }
    return user;
  }
}

export class DevelopmentAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    // Always allow access in development
    if (DISABLE_AUTH) {
      return true;
    }
    try {
      return super.canActivate(context);
    } catch (error) {
      // If auth fails in development, still allow
      if (DISABLE_AUTH) {
        return true;
      }
      throw error;
    }
  }

  public handleRequest(err, user, info) {
    // Return mock user for development if auth is disabled
    if (DISABLE_AUTH) {
      return { id: 1, email: 'dev@example.com', sessionId: 'dev-session' };
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
