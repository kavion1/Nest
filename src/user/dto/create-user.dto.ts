import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly UserName: string;

  @ApiProperty({ description: '昵称' })
  public NickName: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly PassWord: string;

  @ApiProperty({ description: '头像' })
  public Avatar: string;

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  readonly email: string;

  @ApiProperty({ description: '角色' })
  public role: string;
}
