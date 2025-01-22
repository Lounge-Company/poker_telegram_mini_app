import { Room } from 'colyseus'
import { GameManager } from '../managers/GameManager'
import { RoomManager } from '../managers/RoomManager'
import { GameState } from '../rooms/schema/GameState'
import { TurnValidator } from '../midleware/TurnValidator'

export class GameHandlers {
  constructor(private room: Room, private state: GameState) {}
  registerHandlers() {
    const validateTurn = TurnValidator.validate(this.state)
    this.room.onMessage('bet', validateTurn(this.handlePlayerBet.bind(this)))
    this.room.onMessage('check', validateTurn(this.handlePlayerCheck.bind(this)))
    this.room.onMessage('call', validateTurn(this.handlePlayerCall.bind(this)))
    this.room.onMessage('fold', validateTurn(this.handlePlayerFold.bind(this)))
  }
  private isCurrentPlayer(playerId: string): boolean {
    return playerId === this.state.currentTurn
  }
  private handlePlayerCheck(client: any) {
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
  }
  private handlePlayerCall(client: any) {
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
  }
  private handlePlayerFold(client: any) {
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
  }
  private handlePlayerBet(client: any, amount: number) {
    if (!this.isCurrentPlayer(client.sessionId)) return
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
    player.currentBet = amount
  }
}
