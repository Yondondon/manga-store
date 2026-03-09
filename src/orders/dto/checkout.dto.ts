import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({
    example: '221b Baker St., London NW1 6XE, UK',
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  shippingAddress: string;
}
