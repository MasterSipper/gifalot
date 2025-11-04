import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common/decorators';
import { Redis } from 'ioredis';

@Injectable()
export class SessionService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async createSession(session: Session, expiresIn: number) {
    await this.redis.setex(
      this.buildKey(session.id),
      expiresIn,
      JSON.stringify(session),
    );
  }

  public async getSession(id: string) {
    return this.redis.get(this.buildKey(id));
  }

  public async deleteSession(id: string) {
    return this.redis.del(this.buildKey(id));
  }

  public buildKey(id: string) {
    return `session#${id}`;
  }
}

export type Session = {
  id: string;
};
