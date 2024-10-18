import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestUser } from '../entities/contest-user.entity';
import { ContestUserService } from '../services/contest-user.service';
import { ContestUserRepository } from '../repositories/contest-user.repository';
import { ContestUserController } from '../controllers/contest-user.controller';
import { RedisModule } from './redis.module';
import { RedisService } from '../services/redis.service';
import { KafkaModule } from './kafka.module';
import { KafkaService } from '../services/kafka.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContestUser]), RedisModule, KafkaModule],
  controllers: [ContestUserController],
  providers: [
    ContestUserService,
    ContestUserRepository,
    RedisService,
    KafkaService,
  ],
  exports: [],
})
export class ContestUserModule {}
