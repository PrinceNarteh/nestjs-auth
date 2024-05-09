import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redis.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redis.get(this.getKey(userId));
    return storedId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redis.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
