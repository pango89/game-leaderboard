import { Test, TestingModule } from '@nestjs/testing';
import { ContestUserService } from './contest-user.service';
import { ContestUserRepository } from '../repositories/contest-user.repository';
import { RedisService } from './redis.service';
import { KafkaService } from './kafka.service';
import { Producer } from 'kafkajs';
import { ContestUser } from '../entities/contest-user.entity';
import { PaginatedResponse } from '../dtos/paginated-response.dto';

describe('ContestUserService', () => {
  let service: ContestUserService;
  let contestUserRepository: ContestUserRepository;
  let redisService: RedisService;
  let kafkaService: KafkaService;
  let producerMock: Producer;

  beforeEach(async () => {
    // Create a mock for each dependency
    const contestUserRepositoryMock = {
      get: jest.fn(),
      upsertContestUser: jest.fn(),
    };

    const redisServiceMock = {
      zAdd: jest.fn(),
    };

    producerMock = {
      connect: jest.fn(),
      send: jest.fn(),
    } as unknown as Producer;

    const kafkaServiceMock = {
      getClient: jest.fn().mockReturnValue({
        producer: jest.fn().mockReturnValue(producerMock),
      }),
    };

    // Create the testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContestUserService,
        { provide: ContestUserRepository, useValue: contestUserRepositoryMock },
        { provide: RedisService, useValue: redisServiceMock },
        { provide: KafkaService, useValue: kafkaServiceMock },
      ],
    }).compile();

    // Get the service and mocks
    service = module.get<ContestUserService>(ContestUserService);
    contestUserRepository = module.get<ContestUserRepository>(
      ContestUserRepository,
    );
    redisService = module.get<RedisService>(RedisService);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  describe('onModuleInit', () => {
    it('should connect the Kafka producer', async () => {
      await service.onModuleInit();
      expect(producerMock.connect).toHaveBeenCalled();
    });
  });

  describe('getByContestId', () => {
    it('should return paginated response from repository', async () => {
      const mockPaginatedResponse = new PaginatedResponse<ContestUser>(
        [],
        0,
        0,
        10,
      );
      contestUserRepository.get = jest
        .fn()
        .mockResolvedValue(mockPaginatedResponse);

      const result = await service.getByContestId({
        contestId: 1,
        offset: 0,
        limit: 10,
      });

      expect(contestUserRepository.get).toHaveBeenCalledWith({
        filterBy: { contestId: 1 },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should throw an error if repository throws', async () => {
      contestUserRepository.get = jest
        .fn()
        .mockRejectedValue(new Error('Repository error'));

      await expect(
        service.getByContestId({ contestId: 1, offset: 0, limit: 10 }),
      ).rejects.toThrow('Repository error');
    });
  });

  describe('upsert', () => {
    it('should upsert a contest user and send a message to Kafka', async () => {
      const mockContestUser = {
        contestId: 1,
        userId: 1,
        username: 'testUser',
        score: 100,
      } as ContestUser;

      contestUserRepository.upsertContestUser = jest
        .fn()
        .mockResolvedValue(mockContestUser);
      producerMock.send = jest.fn().mockResolvedValue(null);

      await service.upsert(mockContestUser);

      expect(contestUserRepository.upsertContestUser).toHaveBeenCalledWith({
        userId: 1,
        contestId: 1,
        username: 'testUser',
        score: 100,
      });

      expect(producerMock.send).toHaveBeenCalledWith({
        topic: 'contest.user.score.updated',
        messages: [{ value: JSON.stringify(mockContestUser) }],
      });
    });

    it('should throw an error if upsert fails', async () => {
      contestUserRepository.upsertContestUser = jest
        .fn()
        .mockRejectedValue(new Error('Upsert error'));

      const mockContestUser = {
        contestId: 1,
        userId: 1,
        username: 'testUser',
        score: 100,
      } as ContestUser;

      await expect(service.upsert(mockContestUser)).rejects.toThrow(
        'Upsert error',
      );
    });

    it('should throw an error if Kafka producer fails', async () => {
      const mockContestUser = {
        contestId: 1,
        userId: 1,
        username: 'testUser',
        score: 100,
      } as ContestUser;

      contestUserRepository.upsertContestUser = jest
        .fn()
        .mockResolvedValue(mockContestUser);
      producerMock.send = jest.fn().mockRejectedValue(new Error('Kafka error'));

      await expect(service.upsert(mockContestUser)).rejects.toThrow(
        'Kafka error',
      );
    });
  });
});
