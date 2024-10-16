import {
  Controller,
  ValidationPipe,
  Query,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { ContestUserService } from '../services/contest-user.service';
import { ContestUser } from '../entities/contest-user.entity';

@ApiTags('Contest Users')
@Controller('contests')
export class ContestUserController {
  constructor(private contestUserService: ContestUserService) {}

  @Get(':contestId/users')
  public async getContestUsers(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Query(new ValidationPipe({ transform: true }))
    query: {
      offset: number;
      limit: number;
    },
  ): Promise<PaginatedResponse<ContestUser>> {
    const { limit = 10, offset = 0 } = query;
    return await this.contestUserService.getByContestId({
      contestId,
      offset,
      limit,
    });
  }
}
