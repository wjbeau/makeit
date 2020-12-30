import { Attachment } from '@makeit/types';
import {
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':fileId')
  async getFile(@Param('fileId') fileId, @Response() res) {
    res.sendFile(fileId, { root: 'file_uploads' });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.BACKEND_FILE_UPLOADS,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    })
  )
  async uploadFileAsAttachment(@UploadedFile() file) {
    const result: Attachment = {
      reference: file.filename,
      attachmentType: null,
      fileName: file.originalname,
      mimeType: file.mimetype,
      displayName: null,
      size: file.size,
    };

    return result;
  }
}
