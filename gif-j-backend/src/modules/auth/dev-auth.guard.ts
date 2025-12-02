import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// TODO: Re-enable authentication when ready
// Set DISABLE_AUTH to false to re-enable authentication checks
const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true' || process.env.STAGE === 'local';

/**
 * Development Auth Guard that bypasses authentication when DISABLE_AUTH is true.
 * This guard can be used as a drop-in replacement for AuthGuard('jwt') in development.
 * 
 * Usage: Replace @UseGuards(AuthGuard('jwt')) with @UseGuards(DevAuthGuard)
 * Or keep using AuthGuard('jwt') - it will work with the modified AccessTokenStrategy
 */
export class DevAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    // Always allow access in development
    if (DISABLE_AUTH) {
      return true;
    }
    return super.canActivate(context);
  }

  public handleRequest(err: any, user: any, info: any) {
    // Return mock user for development if auth is disabled
    if (DISABLE_AUTH) {
      return { id: 1, email: 'dev@example.com', sessionId: 'dev-session' };
    }
    // In production, use normal error handling
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}











