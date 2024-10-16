import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestUser } from '../entities/contest-user.entity';
import { ContestUserService } from '../services/contest-user.service';
import { ContestUserRepository } from '../repositories/contest-user.repository';
import { ContestUserController } from '../controllers/contest-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContestUser])],
  controllers: [ContestUserController],
  providers: [ContestUserService, ContestUserRepository],
  exports: [],
})
export class ContestUserModule {}
