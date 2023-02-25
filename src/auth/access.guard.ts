import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TAccessTokenPayload } from './auth.type';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const bearerToken = request.headers.authorization;
    if (!bearerToken) return false;
    const token = bearerToken.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload as TAccessTokenPayload;
      return true;
    } catch (error) {
      console.error(JSON.stringify(error));
      if (error && error.message === 'jwt expired') {
        throw new UnauthorizedException();
      }
      return false;
    }
  }
}
