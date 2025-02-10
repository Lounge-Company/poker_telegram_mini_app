import { Room, Client } from 'colyseus'
import { MessageService } from '../services/messageService'
import { RoomManager } from '../managers/RoomManager'
import { ClientService } from '../services/clientService'
import { GameEventEmitter } from '../events/gameEvents'
import { PlayerState } from '../rooms/schema/PlayerState'
import { isValidName, isValidSeat } from '../utils/isValid'
import { canStartGame } from '../utils/game/canStart'
import { MyRoom } from '../rooms/MyRoom'
import {
  onMessage,
  registerHandlers,
} from '../utils/decorators/registerHandler.decorator'

export class RoomHandlers {
  eventEmitter: GameEventEmitter
  MessageService: MessageService
  clientService: ClientService
  constructor(private room: Room, private roomManager: RoomManager) {
    this.MessageService = new MessageService()
    this.clientService = new ClientService()
    this.eventEmitter = GameEventEmitter.getInstance()
    registerHandlers(this, this.room)
  }

  @onMessage('message')
  private handleChatMessage(client: Client, message: string) {
    // refactor this
    const player =
      this.room.state.players.get(client.sessionId) ||
      this.room.state.spectators.get(client.sessionId)
    this.clientService.broadcastMessage(this.room, message, player)
  }
  @onMessage('ready')
  private handlePlayerReady(client: Client) {
    const player: PlayerState = this.room.state.players.get(client.sessionId)
    if (!player) return
    if (player.ready) return
    player.ready = true
    this.room.state.readyPlayers++

    if (canStartGame(this.room as MyRoom)) {
      this.room.state.readyPlayers = 0
      this.eventEmitter.emit('gameStart')
      this.clientService.broadcastSystemMessage(this.room, 'Game started!')
    }
  }
  @onMessage('unready')
  private handlePlayerUnready(client: Client) {
    const player = this.room.state.players.get(client.sessionId)
    if (!player) return
    player.ready = false
    this.room.state.readyPlayers -= 1
  }
  @onMessage('joinGame')
  private handlePlayerJoin(
    client: Client,
    data: { seatIndex: number; name: string }
  ) {
    // refactor this
    if (isValidSeat(data.seatIndex)) {
      this.clientService.sendSystemMessage(client, 'Invalid seat number')
      return
    }
    if (isValidName(data.name)) {
      this.clientService.sendSystemMessage(client, 'Invalid name')
      return
    }
    const success = this.roomManager.handlePlayerJoinToGame(
      client.sessionId,
      data.name,
      data.seatIndex
    )
    if (!success) {
      this.clientService.sendSystemMessage(
        client,
        `seat ${data.seatIndex + 1} is already taken`
      )
      return
    }
    // this.clientService.broadcastSystemMessage(
    //   this.room,
    //   `Player ${client.sessionId} joined to at seat ${data.seatNumber}`
    // )
  }
  @onMessage('leaveGame')
  private handlePlayerLeave(client: Client) {
    // refactor this
    const seatNumber = this.room.state.seats.find(
      (s: { playerId: any }) => s.playerId === client.sessionId
    )?.index
    const success = this.roomManager.handlePlayerLeaveGame(client.sessionId)

    if (success) {
      this.clientService.broadcastSystemMessage(
        this.room,
        `Player ${client.sessionId} left seat ${seatNumber + 1}`
      )
    }
  }
}
