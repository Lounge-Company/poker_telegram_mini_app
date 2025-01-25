import { Room } from 'colyseus'

import { GameState } from '../rooms/schema/GameState'
import { TurnValidator } from '../midleware/TurnValidator'
import { ActionService } from '../services/actionService'

export class GameHandlers {
  private actionService: ActionService
  constructor(private room: Room, private state: GameState) {
    this.actionService = new ActionService(state)
  }
  registerHandlers() {
    const validateTurn = TurnValidator.validate(this.state)
    this.room.onMessage('bet', validateTurn(this.handlePlayerBet.bind(this)))
    this.room.onMessage('check', validateTurn(this.handlePlayerCheck.bind(this)))
    this.room.onMessage('call', validateTurn(this.handlePlayerCall.bind(this)))
    this.room.onMessage('fold', validateTurn(this.handlePlayerFold.bind(this)))
  }

  private handlePlayerCheck = (client: any) => {
    this.actionService.check(client.sessionId)
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
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
    player.currentBet = amount
  }
}
