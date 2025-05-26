import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';

@Module({
  imports: [RoomModule]
})
export class ApiModule {}
