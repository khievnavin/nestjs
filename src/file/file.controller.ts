import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get()
  getAllFiles(@Query('userId') userId: number) {
    return this.fileService.getAllFiles(userId);
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const fileStream = await this.fileService.getFileStream(filename);
    if (!fileStream) {
      res.status(404).send({ message: 'File not found' });
    } else {
      fileStream.pipe(res);
    }
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 5))
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() userId: User,
  ) {
    console.log('files', files);
    return this.fileService.saveFiles(files, userId.id);
  }
}
