import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class OptionalJwtAccessAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  public handleRequest(err, user, info) {
    if (info && info?.message !== 'No auth token') {
      throw new UnauthorizedException();
    }
    return user;
  }
}
