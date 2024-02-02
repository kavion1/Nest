import { Injectable, Query } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
  sayHello(): string {
    return 'say Hello';
  }

  findFile(id) {
    console.log("🚀 ~ AppService ~ findFile ~ id:", id)
    return require(`../public/static/${id}`)

  }
}
