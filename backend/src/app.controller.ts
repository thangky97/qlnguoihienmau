import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import * as mime from 'mime-types';
import { diskStorage } from 'multer';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor() {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          cb(null, Math.floor(Math.random() * 1000000) + Date.now() + '.' + mime.extension(file.mimetype));
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        // Nếu không có tệp được tải lên, xử lý lỗi ở đây
        throw new Error('No file uploaded');
      }

      // Xử lý logic tệp ở đây

      return `${process.env.BE_URL}/${file.filename}`;
      // hoặc return file.filename; tùy thuộc vào yêu cầu của bạn
    } catch (error) {
      // Xử lý lỗi tại đây
      console.error('Upload error:', error.message);
      throw new Error('Upload failed');
    }
  }
}
