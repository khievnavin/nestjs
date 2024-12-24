import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    BookmarkModule,
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    FileModule,
    MulterModule.register({ dest: '/upload' }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
