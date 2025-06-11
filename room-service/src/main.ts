import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  process.on('SIGINT', async () => {
    console.log('SIGINT received, closing app...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing app...');
    await app.close();
    process.exit(0);
  });
}

bootstrap();
