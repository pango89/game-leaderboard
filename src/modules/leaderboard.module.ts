import { Module } from '@nestjs/common';
import { ContestUserService } from '../services/contest-user.service';
import { LeaderboardController } from '../controllers/leaderboard.controller';
import { ContestUserRepository } from '../repositories/contest-user.repository';
import { LeaderboardService } from '../services/leaderboard.service';
import { RedisService } from '../services/redis.service';
import { RedisModule } from './redis.module';

@Module({
  imports: [RedisModule],
  controllers: [LeaderboardController],
  providers: [
    RedisService,
    LeaderboardService,
    ContestUserService,
    ContestUserRepository,
  ],
  exports: [],
})
export class LeaderboardModule {}
