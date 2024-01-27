import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(User)
    private jwtService: JwtService,
    private userService: UserService,
    // private httpService: HttpService,
  ) { }
  CreateToken(user: Partial<User>) {

    return this.jwtService.sign(user);
  }
  async login(user: Partial<User>) {
    const token = this.CreateToken({
      id: user.id,
      UserName: user.UserName,
      role: user.role,
    });
    return {
      token,
      UserName: user.UserName,
      role: user.role,
      avatar: user.Avatar,
      NickName: user.NickName,
    };
  }

  async getUser(user) {
    return this.userService.findOne(user.id);
  }

  async getALLUser(user) {
    return this.userService.findAll(user);
  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
