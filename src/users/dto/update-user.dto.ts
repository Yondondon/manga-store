import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane Doe', minLength: 1 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
