import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { RedisService } from './redis.service';
import { LeaderboardEntry } from '../dtos/leaderboard-entry.dt';
import { ContestUserService } from './contest-user.service';
import { Payload } from '@nestjs/microservices';
import { Consumer } from 'kafkajs';
import { KafkaService } from './kafka.service';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  private logger: Logger = new Logger('ContestUserService');
  private consumer: Consumer;

  constructor(
    private readonly redisService: RedisService,
    private readonly contestUserService: ContestUserService,
    private readonly kafkaService: KafkaService,
  ) {
    this.consumer = this.kafkaService.getClient().consumer({
      groupId: 'origami-consumer-group',
    });
  }

  async onModuleInit() {
    this.logger.log('LeaderboardService initialized');
    await this.initLeaderboard();

    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'contest.user.score.updated',
      fromBeginning: true,
    });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `Received message from topic ${topic}: ${partition} ${message.value.toString()}`,
        );
        this.handleContestUserScoreUpdate(message);
      },
    });
  }

  private async initLeaderboard() {
    try {
      await this.redisService.del('leaderboard:1');
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

  // Method to consume messages from Kafka topic

  async handleContestUserScoreUpdate(@Payload() message: any) {
    this.logger.log(`Received message: ${JSON.stringify(message.value)}`);

    // Assuming the message contains contestUser data
    const contestUserData = JSON.parse(message.value);

    // Update the Redis leaderboard with the new contest user score
    await this.redisService.zAdd(
      `leaderboard:${contestUserData.contestId}`,
      contestUserData.username,
      contestUserData.score,
    );

    this.logger.log(
      `Updated leaderboard for contest ID: ${contestUserData.contestId}`,
    );
  }
}
