import {
  Controller,
  ValidationPipe,
  Query,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { ContestUserService } from '../services/contest-user.service';
import { ContestUser } from '../entities/contest-user.entity';
import {
  PaginationQueryDto,
  UpsertContestUserDto,
} from '../dtos/contest-user.dto.ts';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Contest Users')
@Controller('contests')
export class ContestUserController {
  constructor(private contestUserService: ContestUserService) {}

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
  @Get(':contestId/users')
  public async getContestUsers(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto,
  ): Promise<PaginatedResponse<ContestUser>> {
    const { limit = 10, page = 0 } = query;
    return await this.contestUserService.getByContestId({
      contestId,
      offset: page,
      limit,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':contestId/users')
  public async upsertContestUser(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Body(new ValidationPipe({ transform: true })) body: UpsertContestUserDto,
    @Request() req,
  ): Promise<void> {
    const { sub: userId } = req.user;
    console.log(userId); // Use User Id or other fields from decoded JWT
    await this.contestUserService.upsert({
      contestId,
      ...body,
    });
  }
}
