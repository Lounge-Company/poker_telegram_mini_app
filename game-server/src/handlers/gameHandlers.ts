import { Room } from 'colyseus'
import { GameManager } from '../managers/GameManager'
import { RoomManager } from '../managers/RoomManager'

export class GameeHandlers {
  constructor(
    private room: Room,
    private gameManager: GameManager,
    private roomManager: RoomManager
  ) {}
  registerHandlers() {}
  private handlePlayerCheck(client: any) {
    const player = this.room.state.players.get(client.sessionId)
  }
  private handlePlayerCalll(client: any) {
    const player = this.room.state.players.get(client.sessionId)
  }
  private handlePlayerFold(client: any) {
    const player = this.room.state.players.get(client.sessionId)
  }
  private handlePlayerBet(client: any, amount: number) {
    const player = this.room.state.players.get(client.sessionId)
  }
}
