import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'My cool room', description: 'Название комнаты' })
  name: string;

  @ApiProperty({ example: 4, description: 'max players' })
  maxPlayers: number;
}
export class GetRoomDto {
  @ApiProperty({ example: 1, description: 'room id' })
  id: number;

  // @ApiProperty({ example: 'Uuid', description: 'Uuid of creator' })
  // creatorID: string;
  @ApiProperty({ example: 2567, description: 'room id for connect' })
  connectID: number;

  @ApiProperty({ example: 0, description: 'count of players' })
  players: number;

  @ApiProperty({ example: 10, description: 'Max players number' })
  maxPlayers: number;
}
