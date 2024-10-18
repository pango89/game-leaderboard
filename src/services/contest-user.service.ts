import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { ContestUserRepository } from '../repositories/contest-user.repository';
import { ContestUser } from '../entities/contest-user.entity';
import { RedisService } from './redis.service';
import { KafkaService } from './kafka.service';
import { Producer } from 'kafkajs';

@Injectable()
export class ContestUserService implements OnModuleInit {
  private logger: Logger = new Logger('ContestUserService');
  private producer: Producer;

  constructor(
    private readonly contestUserRepository: ContestUserRepository,
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
  ) {
    this.producer = this.kafkaService.getClient().producer();
  }

  public async onModuleInit() {
    await this.init();
  }

  private async init() {
    await this.producer.connect();
    console.log('Producer connected');
  }

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

      await this.producer.send({
        topic: `contest.user.score.updated`,
        messages: [{ value: JSON.stringify(contestUser) }],
      });

      console.log(`Message sent to topic!!`);

      // // update sorted set
      // await this.redisService.zAdd(
      //   `leaderboard:${contestUser.contestId}`,
      //   contestUser.username,
      //   contestUser.score,
      // );
    } catch (error) {
      throw error;
    }
  }
}
