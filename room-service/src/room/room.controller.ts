import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from 'src/types/room.type'; // если интерфейс Room определён там же
import { GetRoomDto } from './dto/room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getRooms(): Promise<GetRoomDto[]> {
    return this.roomService.getAllRooms();
  }

  @Post()
  async createRoom(@Body() body: Partial<Room> = {}): Promise<Room> {
    return this.roomService.createRoom(body);
  }
}
