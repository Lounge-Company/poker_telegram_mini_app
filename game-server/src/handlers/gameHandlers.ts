import { Room, Client } from 'colyseus'
import { GameState } from '../rooms/schema/GameState'
import { TurnValidator } from '../midleware/TurnValidator'
import { ActionService } from '../services/actionService'
import { ClientService } from '../services/clientService'
import {
  registerHandlers,
  onMessage,
} from '../utils/decorators/registerHandler.decorator'

export class GameHandlers {
  actionService: ActionService
  clientService: ClientService
  constructor(private room: Room, private state: GameState) {
    this.actionService = new ActionService(state)
    this.clientService = new ClientService()
    registerHandlers(this, this.room)
  }

  /**
   * Handles player's check action
   * @param client - Client performing the action
   * @example
   * // Client side
   * room.send("check");
   */
  @onMessage('check')
  handlePlayerCheck(client: Client) {
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
  @onMessage('call')
  handlePlayerCall(client: Client) {
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
  @onMessage('fold')
  handlePlayerFold(client: Client) {
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
  @onMessage('bet')
  handlePlayerBet(client: Client, amount: number) {
    if (typeof amount !== 'number' || isNaN(amount)) return
    console.log('handlePlayerBet :', client.sessionId, amount)
    const success = this.actionService.bet(client.sessionId, amount)
    if (!success) return
    this.clientService.broadcastPlayerBet(this.room, client.sessionId, amount)
  }
}
