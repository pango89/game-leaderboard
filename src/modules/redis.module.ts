import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        const redis = new Redis({
          host: process.env.REDIS_HOST || 'localhost', // Redis server host
          port: +process.env.REDIS_PORT || 6379, // Redis server port
          // password: 'your-redis-password', // Uncomment if using Redis password
        });
        redis.on('connect', () => console.log('Redis connected'));
        redis.on('error', (err) => console.error('Redis error:', err));
        return redis;
      },
    },
  ],
  exports: ['REDIS'], // Export so it's injectable in other modules
})
export class RedisModule {}
