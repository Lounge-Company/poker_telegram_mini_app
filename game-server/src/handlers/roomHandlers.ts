import { Room, Client } from 'colyseus'
import { MessageService } from '../services/messageService'
import { RoomManager } from '../managers/RoomManager'
import { ClientService } from '../services/clientService'
import { GameEventEmitter } from '../events/gameEventEmitter'
import { PlayerState } from '../rooms/schema/PlayerState'
import { isValidName, isValidSeat } from '../utils/isValid'
import { canStartGame } from '../utils/game/canStart'
import { MyRoom } from '../rooms/MyRoom'
import {
  onMessage,
  registerHandlers
} from '../utils/decorators/registerHandler.decorator'

export class RoomHandlers {
  eventEmitter: GameEventEmitter
  MessageService: MessageService
  clientService: ClientService
  constructor(private room: Room) {
    this.MessageService = new MessageService()
    this.clientService = ClientService.getInstance()
    this.eventEmitter = GameEventEmitter.getInstance()
    registerHandlers(this, this.room)
  }

  /**
   * Handles player's call action
   * @param client - Client performing the action
   * @example
   * // Client side
   * room.send("message");
   */
  @onMessage('message')
  handleChatMessage(client: Client, message: string) {
    // fix this
    const player =
      this.room.state.players.get(client.sessionId) ||
      this.room.state.spectators.get(client.sessionId)
    this.clientService.broadcastMessage(message, player)
  }

  /**
   * Handles player's call action
   * @param client - Client performing the action
   * @example
   * // Client side
   * room.send("ready");
   */
  @onMessage('ready')
  handlePlayerReady(client: Client) {
    this.eventEmitter.emit('playerReady', client.sessionId)
  }

  /**
   * Handles player's call action
   * @param client - Client performing the action
   * @example
   * // Client side
   * room.send("unready");
   */
  @onMessage('unready')
  handlePlayerUnready(client: Client) {
    const player = this.room.state.players.get(client.sessionId)
    if (!player) return
    player.ready = false
    this.room.state.readyPlayers -= 1
  }

  /**
   * Handles player's call action
   * @param client - Client performing the action
   * @example
   * // Client side
   * room.send("joinGame");
   */
  @onMessage('joinGame')
  handlePlayerJoin(client: Client, data: { seatIndex: number; name: string }) {
    if (!isValidSeat(data.seatIndex)) {
      this.clientService.sendSystemMessage(
        client.sessionId,
        `Invalid seat number ${data.seatIndex} ${data.name}`
      )
      return
    }
    if (!isValidName(data.name)) {
      this.clientService.sendSystemMessage(client.sessionId, 'Invalid name')
      return
    }
    this.eventEmitter.emit(
      'playerJoin',
      client.sessionId,
      data.seatIndex,
      data.name
    )
  }

  /**
   * Handles player's call action
   * @param client - Client performing the action
   * @example
   * // Client side
   * room.send("leaveGame");
   */
  @onMessage('leaveGame')
  handlePlayerLeave(client: Client): void {
    this.eventEmitter.emit('playerLeave', client.sessionId)
  }
}
