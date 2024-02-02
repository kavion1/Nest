import { Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { extname } from 'path';



@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('findFile')
  findFile(@Query('id') req): any {
    console.log("🚀 ~ AppController ~ findFile ~ id:", req)
    return this.appService.findFile(req);
  }
  @Get('sayHello')
  sayHello(): string {
    return this.appService.sayHello();
  }


}


