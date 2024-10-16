import { Injectable, Logger } from '@nestjs/common';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { RedisService } from './redis.service';
import { LeaderboardEntry } from '../dtos/leaderboard-entry.dt';
import { ContestUserService } from './contest-user.service';

@Injectable()
export class LeaderboardService {
  private logger: Logger = new Logger('ContestUserService');

  constructor(
    private readonly redisService: RedisService,
    private readonly contestUserService: ContestUserService,
  ) {}

  async onModuleInit() {
    await this.initLeaderboard();
  }

  private async initLeaderboard() {
    try {
      await this.redisService.del('leaderboard:*');
      const contestUsers = await this.contestUserService.getByContestId({
        contestId: 1,
        offset: 0,
        limit: 10000,
      });

      for (const contestUser of contestUsers.data) {
        await this.redisService.zAdd(
          `leaderboard:${contestUser.contestId}`,
          contestUser.username,
          contestUser.score,
        );
      }
    } catch (error) {
      this.logger.error('Error populating Redis sorted set:', error);
    }
  }

  public async getByContestId({
    contestId,
    page = 0,
    limit = 10,
  }: {
    contestId: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<LeaderboardEntry>> {
    try {
      const userScores = await this.redisService.zRevRange(
        `leaderboard:${contestId}`,
        page * limit,
        page * limit + limit - 1,
      );

      const count = await this.redisService.zCard(`leaderboard:${contestId}`);

      const leaderboardEntries: LeaderboardEntry[] = [];
      for (let i = 0; i < userScores.length; i += 2) {
        const rank = await this.redisService.zRevRank(
          `leaderboard:${contestId}`,
          userScores[i],
        ); // this returns 0 based rank
        leaderboardEntries.push(
          new LeaderboardEntry(userScores[i], +userScores[i + 1], rank + 1),
        );
      }

      return new PaginatedResponse(leaderboardEntries, count, page, limit);
    } catch (error) {
      throw error;
    }
  }
}
