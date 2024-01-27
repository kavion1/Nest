import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ReturnError } from 'src/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // console.log('🚀 ~ RolesGuard ~ context:', context);
    //获取路由角色
    const roles = this.reflector.get('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    //读取user
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    // console.log('🚀 ~ RolesGuard ~ roles:', roles, user);
    if (!user) {
      return false;
    }
    //判断用户角色是否包含和roles相同的角色列表，并返回一个布尔类型
    const hasRoles = roles.some((role) => role === user.role)
    return hasRoles;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)