import { Module } from '@nestjs/common';
import { ContestUserService } from '../services/contest-user.service';
import { LeaderboardController } from '../controllers/leaderboard.controller';
import { ContestUserRepository } from '../repositories/contest-user.repository';
import { LeaderboardService } from '../services/leaderboard.service';
import { RedisService } from '../services/redis.service';
import { RedisModule } from './redis.module';
import { KafkaModule } from './kafka.module';
import { KafkaService } from '../services/kafka.service';

@Module({
  imports: [KafkaModule, RedisModule],
  controllers: [LeaderboardController],
  providers: [
    RedisService,
    KafkaService,
    LeaderboardService,
    ContestUserService,
    ContestUserRepository,
  ],
  exports: [],
})
export class LeaderboardModule {}
