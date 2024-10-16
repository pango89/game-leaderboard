import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health.module';
import { RedisModule } from './modules/redis.module';
import { MySQLModule } from './modules/mysql.module';
import { ContestUserModule } from './modules/contest-user.module';
import { LeaderboardModule } from './modules/leaderboard.module';
import { KafkaModule } from './modules/kafka.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    RedisModule,
    KafkaModule,
    MySQLModule,
    ContestUserModule,
    LeaderboardModule,
  ],
  controllers: [],
})
export class AppModule {}
