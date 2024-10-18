import { Test, TestingModule } from '@nestjs/testing';
import { ContestUserController } from './contest-user.controller';
import { ContestUserService } from '../services/contest-user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PaginatedResponse } from '../dtos/paginated-response.dto';
import { ContestUser } from '../entities/contest-user.entity';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UpsertContestUserDto } from '../dtos/contest-user.dto.ts';

describe('ContestUserController', () => {
  let app: INestApplication;
  let contestUserService: ContestUserService;

  beforeEach(async () => {
    const mockContestUserService = {
      getByContestId: jest.fn(),
      upsert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContestUserController],
      providers: [
        {
          provide: ContestUserService,
          useValue: mockContestUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // Mock the JWT Guard
      .compile();

    app = module.createNestApplication();
    await app.init();

    contestUserService = module.get<ContestUserService>(ContestUserService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /contests/:contestId/users', () => {
    it('should return paginated contest users', async () => {
      const mockPaginatedResponse = new PaginatedResponse<ContestUser>(
        [{ contestId: 1, userId: 1, username: 'testUser', score: 100 }],
        1,
        0,
        10,
      );

      jest
        .spyOn(contestUserService, 'getByContestId')
        .mockResolvedValue(mockPaginatedResponse);

      const contestId = 1;
      const query: PaginationQueryDto = { page: 0, limit: 10 };

      const response = await request(app.getHttpServer())
        .get(`/contests/${contestId}/users`)
        .query(query)
        .expect(200);

      expect(contestUserService.getByContestId).toHaveBeenCalledWith({
        contestId: 1,
        offset: 0,
        limit: 10,
      });

      expect(response.body).toEqual({
        data: mockPaginatedResponse.data,
        count: mockPaginatedResponse.count,
        page: mockPaginatedResponse.page,
        limit: mockPaginatedResponse.limit,
      });
    });

    it('should return paginated users with default page and limit if not provided', async () => {
      const mockPaginatedResponse = new PaginatedResponse<ContestUser>(
        [{ contestId: 1, userId: 1, username: 'testUser', score: 100 }],
        1,
        0,
        10,
      );

      jest
        .spyOn(contestUserService, 'getByContestId')
        .mockResolvedValue(mockPaginatedResponse);

      const contestId = 1;

      const response = await request(app.getHttpServer())
        .get(`/contests/${contestId}/users`)
        .expect(200);

      expect(contestUserService.getByContestId).toHaveBeenCalledWith({
        contestId: 1,
        offset: 0,
        limit: 10, // default limit
      });

      expect(response.body).toEqual({
        data: mockPaginatedResponse.data,
        count: mockPaginatedResponse.count,
        page: mockPaginatedResponse.page,
        limit: mockPaginatedResponse.limit,
      });
    });
  });

  describe('POST /contests/:contestId/users', () => {
    it('should upsert contest user', async () => {
      const contestId = 1;
      const upsertDto: UpsertContestUserDto = {
        userId: 1,
        username: 'testUser',
        score: 100,
      };

      const req = { user: { sub: 1 } };

      await request(app.getHttpServer())
        .post(`/contests/${contestId}/users`)
        .set('Authorization', 'Bearer mockJwtToken')
        .send(upsertDto)
        .expect(201);

      expect(contestUserService.upsert).toHaveBeenCalledWith({
        contestId,
        ...upsertDto,
      });
    });

    it('should fail if request body validation fails', async () => {
      const contestId = 1;

      const invalidDto = {
        userId: 1,
        // username is missing
        score: 100,
      };

      await request(app.getHttpServer())
        .post(`/contests/${contestId}/users`)
        .set('Authorization', 'Bearer mockJwtToken')
        .send(invalidDto)
        .expect(400); // Expecting validation error due to missing username
    });
  });
});
