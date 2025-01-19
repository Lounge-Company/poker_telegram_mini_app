import { Room } from 'colyseus'
import { GameManager } from '../managers/GameManager'
import { RoomManager } from '../managers/RoomManager'

export class GameeHandlers {
  constructor(
    private room: Room,
    private gameManager: GameManager,
    private roomManager: RoomManager
  ) {}
  registerHandlers() {
    this.room.onMessage('bet', this.handlePlayerBet.bind(this))
    this.room.onMessage('check', this.handlePlayerCheck.bind(this))
    this.room.onMessage('call', this.handlePlayerCalll.bind(this))
    this.room.onMessage('fold', this.handlePlayerFold.bind(this))
    // this.room.onMessage('raise', this.handlePlayerRaise.bind(this))
  }
  private handlePlayerCheck(client: any) {
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
  }
  private handlePlayerCalll(client: any) {
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
  }
  private handlePlayerFold(client: any) {
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
  }
  private handlePlayerBet(client: any, amount: number) {
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
  }
}
