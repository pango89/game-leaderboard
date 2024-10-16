import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public page?: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public limit?: number = 10;
}

export class UpsertContestUserDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: 1, // Example value
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'The username of the user',
    example: 'blue_whale_001', // Example value
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The score to be incremented for the user',
    example: `100.10`, // Example value
  })
  @IsNumber({}, { message: 'score must be a valid decimal number.' })
  score: number;
}
