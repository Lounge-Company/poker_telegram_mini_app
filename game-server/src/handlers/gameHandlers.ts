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
  private handlePlayerCheck(client: any) {
    const success = this.actionService.check(client.sessionId)
    if (!success) return
    this.clientService.broadcastPlayerCheck(this.room, client.sessionId)
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
    const success = this.actionService.call(client.sessionId)
    if (!success) return
    this.clientService.broadcastPlayerCall(this.room, client.sessionId)
  }
  /**
   * Handles player's Fold action
   * @param client - Client performing the action
   * @example
   * // Client side
   * room.send("fold");
   */
  private handlePlayerFold(client: any) {
    console.log('handlePlayerFold :', client.sessionId)
    const success = this.actionService.fold(client.sessionId)
    if (!success) return
    this.clientService.broadcastPlayerFold(this.room, client.sessionId)
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

  private handlePlayerBet(client: any, amount: number) {
    if (typeof amount !== 'number' || isNaN(amount)) return
    console.log('handlePlayerBet :', client.sessionId, amount)
    const success = this.actionService.bet(client.sessionId, amount)
    if (!success) return
    this.clientService.broadcastPlayerBet(this.room, client.sessionId, amount)
  }
}
