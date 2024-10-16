import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async get(key: string): Promise<string> {
    return await this.redis.get(key);
  }

  // add value and score to sorted set
  async zAdd(key: string, value: string, score: number): Promise<void> {
    await this.redis.zadd(key, score, value);
  }

  // update score in sorted set for value within key
  async zIncrBy(key: string, value: string, score: number): Promise<void> {
    await this.redis.zincrby(key, score, value);
  }

  // get all entries with scores from sorted set sorted by decreasing score
  async zRevRange(key: string, start: number, end: number): Promise<string[]> {
    return await this.redis.zrevrange(key, start, end, 'WITHSCORES');
  }

  // delete key
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // get count of elements in sorted set
  async zCard(key: string): Promise<number> {
    return await this.redis.zcard(key);
  }

  // get rank of value within sorted set
  async zRank(key: string, value: string): Promise<number> {
    return await this.redis.zrank(key, value);
  }

  // get reverse rank of value within sorted set
  async zRevRank(key: string, value: string): Promise<number> {
    return await this.redis.zrevrank(key, value);
  }
}
