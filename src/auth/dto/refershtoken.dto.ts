import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjgsImVtYWlsIjoibmFubzEybmF2aW5AZ21haWwup29tIiwiaWF0IjoxNzM0OTI3OTE1LCJleHAiOjE3MzU1MzI3MTV9.BpDA49i6NNNPDkhdbkZ3woByZLCF19GWagiKDEN3S4Y',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
