import { Injectable, Logger } from '@nestjs/common';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { ContestUserRepository } from '../repositories/contest-user.repository';
import { ContestUser } from '../entities/contest-user.entity';

@Injectable()
export class ContestUserService {
  private logger: Logger = new Logger('ContestUserService');

  constructor(private readonly contestUserRepository: ContestUserRepository) {}

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
}
