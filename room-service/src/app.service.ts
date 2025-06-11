import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { RoomService } from './room/room.service';
import { DockerService } from './docker/docker.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly roomService: RoomService,
    private readonly dockerService: DockerService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    const room = await this.roomService.createRoom({ connectID: 2567 });
    console.log('✅ Initial room started at port:', room.connectID);
  }
}
