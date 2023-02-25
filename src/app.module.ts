import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RefTokenModule } from './ref-token/ref-token.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, RefTokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
