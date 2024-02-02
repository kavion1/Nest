import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';

@Module({
  imports: [

    MulterModule.register({
      storage: diskStorage({
        // 指定文件存储目录
        destination: path.join(__dirname, '../public/static'),
        // 通过时间戳来重命名上传的文件名
        filename: (_, file, callback) => {
          file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
          const fileName = file.originalname;
          return callback(null, fileName);
        },
      }
      )
    }),
    TypeOrmModule.forFeature([Upload]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule { }
