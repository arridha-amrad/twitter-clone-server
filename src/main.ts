import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cp from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cp());
  await app.listen(process.env.PORT!);
}
bootstrap();
