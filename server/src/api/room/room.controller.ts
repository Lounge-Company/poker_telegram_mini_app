import { Controller, Get, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto, GetRoomDto } from 'src/dto/room.dto';

@ApiTags('rooms')
@Controller('api/rooms')
export class RoomController {
  constructor(readonly roomService: RoomService) {}

  @Get()
  @ApiOperation({ summary: 'get list of rooms' })
  @ApiResponse({
    status: 200,
    description: 'rooms list',
    type: [GetRoomDto],
  })
  async getAllRooms() {
    return await this.roomService.getAllRooms();
  }

  @Post()
  async createRoom() {
    return await this.roomService.createRoom();
  }
}
