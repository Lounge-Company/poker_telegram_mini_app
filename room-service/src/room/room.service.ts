import { Injectable } from '@nestjs/common';
import { DockerService } from 'src/docker/docker.service';
import { RedisService } from 'src/redis/redis.service';
import { Room } from 'src/types/room.type';

@Injectable()
export class RoomService {
  private readonly roomsKey = 'rooms:ids';
  private readonly idCounterKey = 'room:id:counter';
  private readonly minPort = 4000;
  private readonly maxPort = 5000;

  constructor(
    private readonly redisService: RedisService,
    private readonly dockerService: DockerService,
  ) {}

  async getAllRooms(): Promise<Room[]> {
    const idsJson = await this.redisService.get(this.roomsKey);
    if (!idsJson) return [];

    const ids: string[] = JSON.parse(idsJson);
    const rooms: Room[] = [];

    for (const id of ids) {
      const roomJson = await this.redisService.get(`room:${id}`);
      if (roomJson) {
        rooms.push(JSON.parse(roomJson));
      }
    }

    return rooms;
  }

  private findFreePort(usedPorts: number[]): number | null {
    for (let port = this.minPort; port <= this.maxPort; port++) {
      if (!usedPorts.includes(port)) return port;
    }
    return null;
  }

  async createRoom(data: Partial<Room> = {}): Promise<Room> {
    const rooms = await this.getAllRooms();
    const usedPorts = rooms.map((r) => r.port);
    const { port, ...rest } = data;
    const freePort = this.findFreePort(usedPorts);
    if (!freePort) throw new Error('No free ports available');

    const id = await this.redisService.incr(this.idCounterKey);

    const containerId = await this.dockerService.startContainer(
      port || freePort,
    );

    const room: Room = {
      id,
      port: port || freePort,
      players: 0,
      maxPlayers: 10,
      heartBeat: null,
      containerId,
      ...rest,
    };

    await this.redisService.set(`room:${id}`, JSON.stringify(room));

    const idsJson = await this.redisService.get(this.roomsKey);
    const ids: string[] = idsJson ? JSON.parse(idsJson) : [];
    ids.push(id.toString());
    await this.redisService.set(this.roomsKey, JSON.stringify(ids));

    return room;
  }
}
