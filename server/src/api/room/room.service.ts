import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoomService {
  baseUrl: string;
  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>(
      'ROOM_SERVICE_HOST',
      'room-service',
    );
    this.baseUrl = `http://${host}:3000`;
  }
  async getAllRooms() {
    try {
      console.log('room service url', this.baseUrl);
      const response = await fetch(`${this.baseUrl}/rooms`);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }
  async createRoom() {
    return 'create room from api';
  }
}
