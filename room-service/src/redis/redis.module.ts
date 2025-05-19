import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

const RedisClientProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('REDIS_HOST', 'redis'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [RedisService, RedisClientProvider],
  exports: [RedisService, RedisClientProvider],
})
export class RedisModule {}
