import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health.module';
import { RedisModule } from './modules/redis.module';
import { MySQLModule } from './modules/mysql.module';

@Module({
  imports: [HealthModule, RedisModule, MySQLModule],
  controllers: [],
})
export class AppModule {}
