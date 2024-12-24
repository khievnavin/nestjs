import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get()
  getAllFiles() {
    return this.fileService.getAllFiles();
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
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    console.log('files', files);
    return this.fileService.saveFiles(files);
  }
}
