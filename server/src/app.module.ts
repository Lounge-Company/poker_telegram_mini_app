import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';

const envFile = fs.existsSync('.env') ? '.env' : '.env.development';
dotenv.config({ path: envFile });
const path = process.env.STATIC_PATH || '../public';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, path),
      serveRoot: '/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
