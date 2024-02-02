import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
    type: UpdateUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File,): Promise<{ url: string }> {
    return this.uploadService.UploadFile(file);
  }

  @Get('Download')
  Download(@Query('key') key: string) {
    return this.uploadService.Download(key);
  }

  @Delete('DeleteDownload')
  DeleteFile(@Query('key') key: string) {
    console.log("🚀 ~ UploadController ~ DeleteFile ~ key:", key)
    return this.uploadService.DeleteFile(key);
  }

  // @Get('FindAll')
  // FindAll() {
  //   return this.uploadService.FindALL()
  // }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
