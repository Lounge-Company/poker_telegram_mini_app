// room/room.module.ts
import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RedisModule } from '../redis/redis.module';
import { DockerModule } from 'src/docker/docker.module';
import { RoomService } from './room.service';

@Module({
  imports: [DockerModule, RedisModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
