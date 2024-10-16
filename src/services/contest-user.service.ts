import { Injectable, Logger } from '@nestjs/common';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { ContestUserRepository } from '../repositories/contest-user.repository';
import { ContestUser } from '../entities/contest-user.entity';
import { RedisService } from './redis.service';

@Injectable()
export class ContestUserService {
  private logger: Logger = new Logger('ContestUserService');

  constructor(
    private readonly contestUserRepository: ContestUserRepository,
    private readonly redisService: RedisService,
  ) {}

  public async getByContestId({
    contestId,
    offset = 0,
    limit = 10,
  }: {
    contestId: number;
    offset?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ContestUser>> {
    try {
      const paginatedResponse: PaginatedResponse<ContestUser> =
        await this.contestUserRepository.get({
          filterBy: {
            contestId,
          },
          skip: offset,
          take: limit,
        });

      return paginatedResponse;
    } catch (error) {
      throw error;
    }
  }

  public async upsert({
    contestId,
    userId,
    username,
    score,
  }: ContestUser): Promise<void> {
    try {
      let contestUser = new ContestUser();
      contestUser.contestId = contestId;
      contestUser.userId = userId;
      contestUser.username = username;
      contestUser.score = score;

      contestUser = await this.contestUserRepository.upsertContestUser({
        userId,
        contestId,
        username,
        score,
      });

      // update sorted set
      await this.redisService.zAdd(
        `leaderboard:${contestUser.contestId}`,
        contestUser.username,
        contestUser.score,
      );
    } catch (error) {
      throw error;
    }
  }
}
