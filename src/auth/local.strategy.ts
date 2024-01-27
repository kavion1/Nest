// local.strategy.ts

import { compareSync } from 'bcryptjs';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

export class LocalStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      usernameField: 'UserName',
      passwordField: 'PassWord',
    } as IStrategyOptions);
  }

  async validate(UserName: string, PassWord: string) {
    console.log('🚀 ~ LocalStorage ~ validate ~ UserName:', UserName);
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.PassWord')
      .where('user.UserName=:UserName', { UserName })
      .getOne();
    if (!user) {
      throw new BadRequestException('用户名不正确！');
    }

    if (!compareSync(PassWord, user.PassWord)) {
      throw new BadRequestException('密码错误！');
    }

    return user;
  }
}
