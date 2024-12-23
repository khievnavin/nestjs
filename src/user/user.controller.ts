import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user.id);
  }

  @Patch()
  editUser(@GetUser() user: User, @Body() dto: EditUserDto) {
    return this.userService.editUser(user.id, dto);
  }
}
