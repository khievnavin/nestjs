import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { FileService } from './file.service';

@Controller('file')
export class FileController {
  //   constructor(private fileService: FileService) {}

  @Get()
  getFile() {
    return 'get file';
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return 'file uploaded';
  }
}
