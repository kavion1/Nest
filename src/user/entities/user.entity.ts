import { Exclude } from 'class-transformer';
import { PostsEntity } from 'src/posts/posts.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 在创建User实体, 使用@PrimaryGeneratedColumn('uuid')创建一个主列id，该值将使用uuid自动生成。 Uuid 是一个独特的字符串;
// 实现字段名驼峰转下划线命名, createTime和updateTime字段转为下划线命名方式存入数据库， 只需要在@Column装饰器中指定name属性；
// 我们使用了装饰器@BeforeInsert来装饰encryptPwd方法，表示该方法在数据插入之前调用，这样就能保证插入数据库的密码都是加密后的。
// 给博客系统设置了三种角色root、autor和 visitor, root有所以权限，author有写文章权限，visitor只能阅读文章， 注册的用户默认是visitor,root权限的账号可以修改用户角色
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number; //id

  @Column({ length: 100 })
  UserName: string; //用户名称

  @Column({ length: 100 })
  NickName: string; //昵称

  @Column()
  @Exclude()
  PassWord: string; //密码

  @Column()
  Avatar: string; //头像

  @Column()
  email: string; //邮箱

  @Column('enum', { enum: ['root', 'author', 'visitor'], default: 'visitor' })
  role: string; //角色



  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date; //创建日期

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date; //更新日期

  @BeforeInsert()
  async encryPtpwd() {
    this.PassWord = await bcrypt.hashSync(this.PassWord);
  }
}
