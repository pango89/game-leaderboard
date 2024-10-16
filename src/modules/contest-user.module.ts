import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestUser } from '../entities/contest-user.entity';
import { ContestUserService } from '../services/contest-user.service';
import { ContestUserRepository } from '../repositories/contest-user.repository';
import { ContestUserController } from '../controllers/contest-user.controller';
import { RedisModule } from './redis.module';
import { RedisService } from '../services/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContestUser]), RedisModule],
  controllers: [ContestUserController],
  providers: [ContestUserService, ContestUserRepository, RedisService],
  exports: [],
})
export class ContestUserModule {}
