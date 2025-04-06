import { RedisClientType } from "redis";
import { redisClient as rawRedisClient } from "../redis";
const redisClient = rawRedisClient as unknown as RedisClientType;

export class Limiter {
  private redisClient: RedisClientType;
  constructor(rc: RedisClientType) {
    this.redisClient = rc;
  }

  async get(id: string, limit = 5, duration: number) {
    const now = Math.floor(Date.now() / 1000);
    const reset = now + duration;
    const key = `rate-limit:${id}`;
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
    const multi = this.redisClient.multi();
    multi.zRemRangeByScore(key, 0, now - duration);
    multi.zAdd(key, { score: reset, value: now.toString() });
    multi.zCard(key);
    multi.expire(key, duration);

    const res = await multi.exec();
    const count = res?.[2] as number;
    const allowed = count <= limit;
    await this.redisClient.disconnect();
    const remaining = Math.max(0, limit - count);

    return {
      allowed,
      remaining,
      reset,
    };
  }
}

export const limit = new Limiter(redisClient);
