import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RefTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const bearerToken = request.cookies.refreshToken;
    if (!bearerToken) return false;
    const token = bearerToken.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      request.app.locals.refTokenPayload = payload;
      return true;
    } catch (error) {
      return false;
    }
  }
}
