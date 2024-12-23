import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, 
          ConfigModule.forRoot({isGlobal:true}), 
          UserModule, 
          BookmarkModule, 
          PrismaModule,
          PassportModule.register({ defaultStrategy: 'jwt' }),]
})
export class AppModule {}
