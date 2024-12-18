import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { User } from '@prisma/client';
import { NOT_CONTAINS } from 'class-validator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) { }

    @Get()
    getBookmarks(@GetUser() userId: User,) {
        console.log('userId :',userId);
        return this.bookmarkService.getBookmarks(userId.id);
    }

    @Get(':id')
    getBookmarkById(
        @GetUser() userId: User, 
        @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.getBookmarkById(userId.id, bookmarkId);
    }

    @Post()
    createBookmark(
        @GetUser() userId: User, 
        @Body() dto: CreateBookmarkDto) {
        return this.bookmarkService.createBookmark(userId.id, dto);
    }

    @Patch(':id')
    editBookmarkById(
        @GetUser('id') userId: User, 
        @Param('id', ParseIntPipe) bookmarkId: number, 
        @Body() dto: EditBookmarkDto) {
        return this.bookmarkService.editBookmarkById(userId.id , bookmarkId, dto);
    }

    // @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(
        @GetUser('id') userId: User, 
        @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookmarkById(userId.id, bookmarkId);
    }

}
