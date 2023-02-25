import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { JwtStrategy } from './jwt.strategy';
import { RefTokenModule } from 'src/ref-token/ref-token.module';

@Module({
  imports: [
    RefTokenModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      privateKey: fs.readFileSync('./private.pem'),
      publicKey: fs.readFileSync('./public.pem'),
      signOptions: {
        algorithm: 'RS256',
        issuer: 'twitter-clone',
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
