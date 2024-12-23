import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditBookmarkDto {
  @ApiProperty({
    example: 'your title',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'your description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'your link',
    required: false,
  })
  @IsString()
  @IsOptional()
  link?: string;
}
