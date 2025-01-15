import { Room } from 'colyseus'
import { MessageService } from '../services/messageService'
import { RoomManager } from '../managers/RoomManager'
import { ClientService } from '../services/clientService'
import { GameLoop } from '../core/GameLoop'

export class RoomHandlers {
  MessageService: MessageService
  clientService: ClientService
  constructor(
    private room: Room,
    private roomManager: RoomManager,
    private gameLoop: GameLoop
  ) {
    this.MessageService = new MessageService()
    this.clientService = new ClientService()
  }

  public registerHandlers() {
    this.room.onMessage('message', this.handleChatMessage.bind(this))
    this.room.onMessage('joinGame', this.handlePlayerJoin.bind(this))
    this.room.onMessage('leaveGame', this.handlePlayerLeave.bind(this))
    this.room.onMessage('ready', this.handlePlayerReady.bind(this))
    this.room.onMessage('unready', this.handlePlayerUnready.bind(this))

    console.log('room handlers registered successfully')
  }

  private handleChatMessage(client: any, message: string) {
    // refactor this
    const player =
      this.room.state.players.get(client.sessionId) ||
      this.room.state.spectators.get(client.sessionId)
    this.clientService.broadcastMessage(this.room, message, player)
  }

  private handlePlayerReady(client: any) {
    const player = this.room.state.players.get(client.sessionId)
    if (!player.ready) {
      player.ready = true
      console.log(`Player ${client.sessionId} is ready`)
      this.room.state.readyPlayers++
      console.log('ready players:', this.room.state.readyPlayers)
      console.log('players in room:', this.room.state.players.size)
      if (
        this.room.state.readyPlayers === this.room.state.players.size &&
        this.room.state.players.size >= 2
      ) {
        this.room.state.readyPlayers = 0
        this.gameLoop.startGame()
        this.clientService.broadcastSystemMessage(this.room, 'Game started!')
      }
    }
  }

  private handlePlayerUnready(client: any) {
    // refactor this
    const player = this.room.state.players.get(client.sessionId)
    if (player.ready) {
      player.ready = false
      this.room.state.readyPlayers--
    }
  }

  private handlePlayerAction(client: any, action: string, amount: number) {}
  private handlePlayerJoin(client: any, seatNumber: number) {
    const success = this.roomManager.handlePlayerJoinToGame(
      client.sessionId,
      seatNumber
    )
    if (!success) {
      console.log(`Player ${client.sessionId} failed to join to the game`)
      this.clientService.sendSystemMessage(
        client,
        `seat ${seatNumber} is already taken`
      )
      return
    }
    console.log(`Player ${client.sessionId} joined to the game`)
    this.clientService.sendSystemMessage(
      client,
      `You joined at seat ${seatNumber}`
    )
  }
  private handlePlayerLeave(client: any) {
    const success = this.roomManager.handlePlayerLeaveGame(client.sessionId)
    if (success) {
      console.log(`Player ${client.sessionId} left the game`)
      this.clientService.broadcastSystemMessage(
        this.room,
        `Player ${client.sessionId} left the game`
      )
    }
  }
}
