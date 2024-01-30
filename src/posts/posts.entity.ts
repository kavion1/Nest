//    posts/posts.entity.ts
import { Exclude } from 'class-transformer';
// import { Exclude } from 'class-transformer';
import { CategoryEntity } from '../category/entities/category.entity';
import { TagEntity } from '../tag/entities/tag.entity';
import { User } from '../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class PostsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number; // 标记为主列，值自动生成

  @Column({ length: 50, comment: '标题' })
  title: string;

  @Column({ type: 'mediumtext', default: null, comment: '内容' })
  content: string;

  // eslint-disable-next-line prettier/prettier
  @Column({ type: 'mediumtext', default: null, name: 'content_html', comment: '内容' })
  contentHtml: string;

  @Column({ type: 'text', default: null, comment: '摘要' })
  summary: string;

  @Column({ type: 'text', default: null, name: 'cover_url', comment: '封面' })
  coverUrl: string;

  @Column({ type: 'int', default: 0, comment: '阅读量' })
  count: number;

  @Column({ type: 'int', default: 0, name: 'like_count', comment: '点赞量' })
  likeCount: number;

  @Column({
    type: 'tinyint',
    default: 0,
    name: 'is_recommend',
    comment: '推荐显示',
  })
  isRecommend: number;

  @Column('simple-enum', { enum: [0, 1], comment: '文章状态' })
  status: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Column({ type: 'varchar', length: 100 })
  authorid: number;

  @Column({ type: 'varchar', length: 100 })
  categoryid: number;
  @Column({ type: 'varchar', length: 100 })
  tagid: number;

  @Column({ type: 'timestamp', name: 'publish_time', default: null, comment: '发布时间' })
  publishTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: '创建时间' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: '更新时间' })
  update_time: Date;
}
