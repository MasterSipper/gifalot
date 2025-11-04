import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  // TODO only for dev
  app.setGlobalPrefix('gif-j');

  await app.listen(PORT);
}
bootstrap();
