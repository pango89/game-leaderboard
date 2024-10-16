import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public limit?: number = 10;
}
