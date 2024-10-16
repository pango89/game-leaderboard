import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health.module';
import { RedisModule } from './modules/redis.module';
import { MySQLModule } from './modules/mysql.module';
import { ContestUserModule } from './modules/contest-user.module';
import { LeaderboardModule } from './modules/leaderboard.module';

@Module({
  imports: [
    HealthModule,
    RedisModule,
    MySQLModule,
    ContestUserModule,
    LeaderboardModule,
  ],
  controllers: [],
})
export class AppModule {}
