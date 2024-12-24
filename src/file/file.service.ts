import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileService {
  private readonly uploadPath = path.join(__dirname, '..', 'uploads');

  constructor(private prisma: PrismaService) {
    // Ensure the uploads directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async getAllFiles() {
    const files = await this.prisma.file.findMany();
    const filesWithUrls = files.map((file) => ({
      ...file,
      url: `${'DATABASE_URL'}/${file.storedName}`,
    }));

    console.log('Fetched Files:', files);
    return {
      message: `${files.length} files found.`,
      files: filesWithUrls,
    };
  }

  async getFileStream(filename: string): Promise<fs.ReadStream | null> {
    const fileRecord = await this.prisma.file.findFirst({
      where: { storedName: filename },
    });

    if (!fileRecord) {
      return null;
    }

    const filePath = path.join(this.uploadPath, fileRecord.storedName);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    return fs.createReadStream(filePath);
  }
  async saveFiles(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const savedFiles = await Promise.all(
      files.map(async (file) => {
        const storedName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadPath, storedName);

        // Save the file to the file system
        fs.writeFileSync(filePath, file.buffer);

        // Save file metadata to the database
        return this.prisma.file.create({
          data: {
            originalName: file.originalname,
            storedName,
            mimeType: file.mimetype,
            size: file.size,
          },
        });
      }),
    );
    console.log('Fetched Files:', files);
    return {
      message: `${files.length} files uploaded successfully.`,
      files: savedFiles,
    };
  }
}
