import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnError } from 'src/utils';
import { Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { CategoryService } from 'src/category/category.service';
import { TagService } from 'src/tag/tag.service';
import { CreatePostDto } from './dto/create-post.dot';
import { UserService } from 'src/user/user.service';
export interface PostsRo {
  list: PostsEntity[];
  count: number;
  pageSize: number;
  pageNum: number;
}
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly userService: UserService,
  ) { }
  // 创建文章
  async create(user, post: Partial<CreatePostDto>): Promise<number> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', HttpStatus.BAD_REQUEST);
    }

    const doc = await this.postsRepository.findOne({
      where: { title },
    });
    if (doc) {
      throw new HttpException('文章已存在', HttpStatus.BAD_REQUEST);
    }

    const { tag, category = 0, status, isRecommend, coverUrl } = post;

    let cateId: number = await this.categoryService.checkName(category.toString())
    let tagid: number = await this.tagService.checkName(category.toString())

    // 根据传入的标签id,如 `1,2`,获取标签
    const tags = await this.tagService.findByIds(('' + tag).split(','));
    console.log("🚀 ~ PostsService ~ create ~ tags:", tags)
    const postParam: Partial<PostsEntity> = {
      ...post,
      isRecommend: isRecommend ? 1 : 0,
      categoryid: cateId,
      tagid: tagid,
      authorid: user.NickName
    };
    // 判断状态，为publish则设置发布时间
    if (status === 1) {
      Object.assign(postParam, {
        publishTime: new Date(),
      });
    }

    const newPost: PostsEntity = await this.postsRepository.create({
      ...postParam,
    });


    const created = await this.postsRepository.save(newPost);

    return created.id;


  }

  async Updatas(Updata: Partial<PostsEntity>): Promise<PostsEntity> {
    const { id } = Updata;
    if (!id) {
      throw new HttpException('请传入id1', 302);
    }
    const Find = await this.postsRepository.findOne({ where: { id } });

    if (!Find) {
      throw new HttpException('此id不存在', 302);
    }
    return this.postsRepository.save(this.postsRepository.merge(Find, Updata));
  }

  async FindAll(query): Promise<PostsRo> {
    try {
      const qb = await this.postsRepository.createQueryBuilder('post');
      qb.where('1 = 1');
      qb.orderBy('post.create_time', 'DESC');

      const count = await qb.getCount();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pageNum = 1, pageSize = 10, ...params } = query;
      qb.limit(pageSize);
      qb.offset(pageSize * (pageNum - 1));

      const posts = await qb.getMany();
      return { list: posts, pageSize, pageNum, count: count };
    } catch (error) {
      console.log('🚀 ~ PostsService ~ FindAll ~ error:', error);
      ReturnError('系统异常', 401);
    }
  }

  async FindById(id): Promise<PostsEntity> {
    return this.postsRepository.findOne({ where: { id } });
  }
  //删除文章
  async remove(param) {
    const { ids } = param;
    if (!ids) {
      throw new HttpException('请传入id删除', 401);
    } else {
      const bool = await this.postsRepository.findOne({ where: { id: ids } });
      if (!bool) {
        throw new HttpException(`id 【${ids}】不存在`, 302);
      } else {
        const res = await this.postsRepository.remove(bool);
        return res;
      }
    }
  }
}
