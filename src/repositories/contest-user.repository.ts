/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { ContestUser } from '../entities/contest-user.entity';

@Injectable()
export class ContestUserRepository extends Repository<ContestUser> {
  constructor(dataSource: DataSource) {
    super(ContestUser, dataSource.createEntityManager());
  }

  public async get({
    filterBy,
    skip = 0,
    take = 10,
  }: {
    filterBy?: any;
    skip?: number;
    take?: number;
  }): Promise<PaginatedResponse<ContestUser>> {
    const { contestId } = filterBy;
    const [contestUsers, count] = await this.findAndCount({
      where: [
        {
          contestId: contestId,
        },
      ],
      take,
      skip,
    });

    return new PaginatedResponse(contestUsers, count, skip, take);
  }

  public async upsertContestUser({
    userId,
    contestId,
    username,
    score,
  }: {
    userId: number;
    contestId: number;
    username: string;
    score: number;
  }): Promise<ContestUser> {
    let contestUser = await this.findOne({
      where: {
        userId: userId,
        contestId: contestId,
      },
    });

    if (contestUser) {
      contestUser.score += score;
    } else {
      contestUser = this.create({
        userId,
        contestId,
        username,
        score,
      });
    }

    return this.save(contestUser);
  }
}
