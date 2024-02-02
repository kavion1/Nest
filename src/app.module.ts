import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
// import { JwtModule, JwtService } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './category/entities/category.entity';
import { PostsEntity } from './posts/posts.entity';
import { TagEntity } from './tag/entities/tag.entity';
import { TagModule } from './tag/tag.module';
import { UploadModule } from './upload/upload.module';
import { User } from './user/entities/user.entity';

import { Upload } from './upload/entities/upload.entity';

// providers：Nest.js注入器实例化的提供者（服务提供者），处理具体的业务逻辑，各个模块之间可以共享（注入器的概念后面依赖注入部分会讲解）；
// controllers：处理http请求，包括路由控制，向客户端返回响应，将具体业务逻辑委托给providers处理；
// imports：导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入；
// exports：导出服务的列表，供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里配置导出；

console.log('__dirname', __dirname + '**/*.entity.{js,ts}');

@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Lyj582595',
      database: 'blog',
      synchronize: true,
      entities: [User, PostsEntity, CategoryEntity, TagEntity, Upload],
    }),
    PostsModule,
    UserModule,
    AuthModule,
    TagModule,
    CategoryModule,
    UploadModule,

  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
