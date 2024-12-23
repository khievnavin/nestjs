import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @ApiProperty({
    example: 'khiev.navin@gmail.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'your firstName',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: ' your lastName',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}
