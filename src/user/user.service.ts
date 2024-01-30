import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnError } from 'src/utils';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }
  /**

   * @param CreateUser 
   * role: 1管理员 2作者 3游客
   * @returns 
   */
  async register(CreateUser: CreateUserDto) {
    const { UserName } = CreateUser;
    // eslint-disable-next-line prettier/prettier
    const ExistUser = await this.userRepository.findOne({ where: { UserName } });
    console.log('🚀 ~ UserService ~ register ~ ExistUser:', ExistUser);
    if (ExistUser) {
      ReturnError(`该用户【${UserName}】已存在`, HttpStatus.BAD_REQUEST);
    }
    const img =
      'https://img.zcool.cn/community/01a3865ab91314a8012062e3c38ff6.png@1280w_1l_2o_100sh.png';
    const NickNames = `nice${Math.random()}`;
    CreateUser = {
      NickName: NickNames,
      role: '3',
      Avatar: img,
      ...CreateUser,
    };
    const newUser = this.userRepository.create(CreateUser);
    return this.userRepository.save(newUser);
  }

  async findAll(user): Promise<any> {
    const qb = await this.userRepository.createQueryBuilder('user');
    qb.where('user.NickName = :NickName', { NickName: user.NickName });
    qb.orderBy('user.create_time', 'ASC');
    qb.limit(1);
    qb.offset(2);
    const posts = await qb.getMany();
    const total = await qb.getCount();
    console.log('qb', posts);
    return { data: posts, total };
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  // async checkName(name: string): Promise<number> {
  //   const List = await this.userRepository.findOne({ where: { name } })
  //   if (List) {
  //     return List.id
  //   } else {
  //     const newparam = await this.userRepository.create({ name })
  //     const info = await this.userRepository.save(newparam)
  //     return info.id
  //   }
  // }

}
