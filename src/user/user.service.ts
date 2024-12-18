import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}
    
    async getMe(userId: number){
    // Fetch the user from the database
    return this.prisma.user.findUnique({
      where: { 
        id: userId 
      },
      select:{
        id:true,
        email: true,
        firstName: true,
        lastName: true,
      }
    });
  }
    async editUser(userId: number,  dto: EditUserDto){
      try{
     const user =  await this.prisma.user.update({
        where: {
            id: userId,
          },
        data: {
            ...dto,
          },
        });
    
        delete user.hash;

        return user;
    }catch(error){
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
