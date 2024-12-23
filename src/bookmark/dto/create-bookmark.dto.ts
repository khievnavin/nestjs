import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    example: 'for title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'for description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'for link',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  link: string;
}
