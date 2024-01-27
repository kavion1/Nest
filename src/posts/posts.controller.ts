import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PostsRo, PostsService } from './posts.service';
import {
  Body,
  Controller,
  Post,
  Delete,
  Put,
  Get,
  Query,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dot';
import { Roles, RolesGuard } from 'src/auth/role.guard';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('文章')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }
  @ApiOperation({ summary: '通过ID找到对应数据' })
  @Get('FIndByid')
  async FIndByid(@Param('id') id): Promise<any> {
    return await this.postsService.FindById(id);
  }

  /**
   * 查询所有
   * @param query
   * @returns
   */
  @ApiOperation({ summary: '查询所有数据' })
  @Get()
  async Page(@Query() query): Promise<PostsRo> {
    return await this.postsService.FindAll(query);
  }

  /**
   * 创建文章
   * @param post
   */
  @ApiOperation({ summary: '创建新文章' })
  @ApiBearerAuth()
  @Roles('admin', 'root')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() post: CreatePostDto, @Req() req) {
    return await this.postsService.create(req.user, post);
  }

  /**
   * 删除文章
   * @param delete
   */
  @ApiOperation({ summary: '删除新文章' })
  @Delete()
  async Delete(@Body() param) {
    return await this.postsService.remove(param);
  }

  /**
   * 更新文章
   * @param Updata
   * @returns
   */
  @ApiOperation({ summary: '更新数据' })
  @Put()
  async Updatas(@Body() Updata) {
    return await this.postsService.Updatas(Updata);
  }
}
