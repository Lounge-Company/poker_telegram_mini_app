import { Schema, Context, type } from '@colyseus/schema'

export class MyRoomState extends Schema {
  @type('string') roomName: string = '' // Имя комнаты
  @type('number') playerCount: number = 0 // Количество игроков в комнате
  @type('number') maxPlayers: number = 12 // Максимальное количество игроков в комнате
  @type('boolean') gameStarted: boolean = false
}
