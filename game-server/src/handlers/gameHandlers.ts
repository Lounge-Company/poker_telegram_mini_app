import { Room, Client } from 'colyseus'
import { GameState } from '../rooms/schema/GameState'
import { TurnValidator } from '../utils/game/TurnValidator'
import { ClientService } from '../services/clientService'
import {
  registerHandlers,
  onMessage,
} from '../utils/decorators/registerHandler.decorator'
import { GameEventEmitter } from '../events/gameEventEmitter'

export class GameHandlers {
  eventEmitter: GameEventEmitter
  clientService: ClientService
  constructor(private room: Room, private state: GameState) {
    this.clientService = ClientService.getInstance()
    this.eventEmitter = GameEventEmitter.getInstance()
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
    if (!TurnValidator(this.state, client.sessionId)) return
    this.eventEmitter.emit('playerCheck', client.sessionId)
    this.clientService.broadcastPlayerCheck(client.sessionId)
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
    if (!TurnValidator(this.state, client.sessionId)) return
    console.log('handlePlayerCall :', client.sessionId)
    this.eventEmitter.emit('playerCall', client.sessionId)
    this.clientService.broadcastPlayerCall(client.sessionId)
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
    if (!TurnValidator(this.state, client.sessionId)) return
    console.log('handlePlayerFold :', client.sessionId)
    this.eventEmitter.emit('playerFold', client.sessionId)
    this.clientService.broadcastPlayerFold(client.sessionId)
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
    if (!TurnValidator(this.state, client.sessionId)) return
    if (isNaN(amount)) return
    console.log('handlePlayerBet :', client.sessionId, amount)
    this.eventEmitter.emit('playerBet', client.sessionId, amount)
    this.clientService.broadcastPlayerBet(client.sessionId, amount)
  }
}
