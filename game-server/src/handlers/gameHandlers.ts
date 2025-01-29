import { Room } from 'colyseus'

import { GameState } from '../rooms/schema/GameState'
import { TurnValidator } from '../midleware/TurnValidator'
import { ActionService } from '../services/actionService'
import { ClientService } from '../services/clientService'

export class GameHandlers {
  actionService: ActionService
  clientService: ClientService
  constructor(private room: Room, private state: GameState) {
    this.actionService = new ActionService(state)
    this.clientService = new ClientService()
  }
  registerHandlers() {
    const validateTurn = TurnValidator.validate(this.state)
    this.room.onMessage('bet', validateTurn(this.handlePlayerBet.bind(this)))
    this.room.onMessage('check', validateTurn(this.handlePlayerCheck.bind(this)))
    this.room.onMessage('call', validateTurn(this.handlePlayerCall.bind(this)))
    this.room.onMessage('fold', validateTurn(this.handlePlayerFold.bind(this)))
  }

  /**
   * Handles player's check action
   * @param client - Client performing the action
   * @example
   * // Client side
   * room.send("check");
   */
  private handlePlayerCheck = (client: any) => {
    console.log('handlePlayerCheck :', client.sessionId)
    console.log('curent bet :', this.state.currentBet)
    console.log('curent turn :', this.state.currentTurn)
    this.actionService.check(client.sessionId)
  }

  /**
   * Handles player's call action
   * @param client - Client performing the action
   * @example
   * // Client side
   * room.send("call");
   */
  private handlePlayerCall(client: any) {
    console.log('handlePlayerCall :', client.sessionId)
    this.actionService.call(client.sessionId)
  }
  private handlePlayerFold(client: any) {
    console.log('handlePlayerFold :', client.sessionId)
    const player = this.room.state.players.get(client.sessionId)
    player.acted = true
  }
  /**
   * Handles player's bet action by deducting the bet amount from player's chips
   * and adding it to the pot.
   * @param client - Client performing the action
   * @param amount - Amount that the player is betting
   * @example
   * // Client side
   * room.send("bet", amount);
   */

  private handlePlayerBet = (client: any, amount: number) => {
    console.log('handlePlayerBet :', client.sessionId, amount)
    this.actionService.bet(client.sessionId, amount)
    this.clientService.broadcastPlayerBet(this.room, client.sessionId, amount)
  }
}
