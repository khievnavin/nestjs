import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: 'asc', // Can be 'asc' or 'desc'
      },
      select: {
        id: true,
        title: true,
        link: true,
        description: true,
        // Do not include fields like createdAt, userId, etc.
      },
    });
    console.log('Fetched Bookmarks:', bookmarks);
    return bookmarks;
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
      select: {
        id: true,
        title: true,
        link: true,
        description: true,
        // Do not include fields like createdAt, userId, etc.
      },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    console.log('current user create bookmark: ', userId);
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return {
      message: 'Bookmark created successfully!',
      bookmark,
    };
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmarkId || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        title: dto.title,
        link: dto.link,
        description: dto.description,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmarkId || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return {
      message: 'Bookmark deleted successfully!',
    };
  }
}
