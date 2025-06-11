import { Injectable } from '@nestjs/common';
import { DockerService } from 'src/docker/docker.service';
import { RedisService } from 'src/redis/redis.service';
import { Room } from 'src/types/room.type';
import { GetRoomDto } from './dto/room.dto';

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

  async getAllRooms(): Promise<GetRoomDto[]> {
    const idsJson = await this.redisService.get(this.roomsKey);
    if (!idsJson) return [];

    const ids: string[] = JSON.parse(idsJson);
    const rooms: GetRoomDto[] = [];

    for (const id of ids) {
      const roomJson = await this.redisService.get(`room:${id}`);
      if (roomJson) {
        const room = JSON.parse(roomJson);
        rooms.push({
          id: room.id,
          connectID: room.connectID,
          players: room.players,
          maxPlayers: room.maxPlayers,
        });
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
    const usedPorts = rooms.map((r) => r.connectID);
    const { connectID, ...rest } = data;
    const freePort = this.findFreePort(usedPorts);
    if (!freePort) throw new Error('No free ports available');

    const id = await this.redisService.incr(this.idCounterKey);

    const containerId = await this.dockerService.startContainer(
      connectID || freePort,
    );

    const room: Room = {
      id,
      connectID: connectID || freePort,
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
