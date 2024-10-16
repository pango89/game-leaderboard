import {
  Controller,
  ValidationPipe,
  Query,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { LeaderboardEntry } from '../dtos/leaderboard-entry.dt';
import { LeaderboardService } from '../services/leaderboard.service';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';

@ApiTags('Contest Leaderboard')
@Controller('contests')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (0 indexed)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit number of entries',
  })
  @Get(':contestId/leaderboard')
  public async getContestLeaderboard(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto,
  ): Promise<PaginatedResponse<LeaderboardEntry>> {
    const { limit = 10, page = 0 } = query;
    return await this.leaderboardService.getByContestId({
      contestId,
      page,
      limit,
    });
  }
}
