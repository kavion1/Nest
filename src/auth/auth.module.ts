import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStorage } from './jwt.strategy';
import { LocalStorage } from './local.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
// 这里不建议将秘钥写死在代码也， 它应该和数据库配置的数据一样，从环境变量中来
const jwtModule = JwtModule.register({
  secret: 'test123456',
  signOptions: { expiresIn: '4h' },
});
// const jwtModule = JwtModule.registerAsync({
//   inject: [ConfigService],
//   useFactory: async (configService: ConfigService) => {
//     return {
//       secret: configService.get('SECRET', 'test123456'),
//       signOptions: { expiresIn: '4h' },
//     };
//   },
// });
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    jwtModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage, JwtStorage, ConfigService],
  exports: [jwtModule],
})
export class AuthModule { }
