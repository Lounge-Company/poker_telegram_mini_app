import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {}

  async onModuleInit() {
    await this.client.flushdb(); // Очистить все данные
    console.log('Redis has been flushed.');
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<'OK'> {
    return this.client.set(key, value);
  }
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }
  get clientInstance(): Redis {
    return this.client;
  }
}
