import { Room } from 'colyseus'
import { GameManager } from '../managers/GameManager'
import { MessageService } from '../services/messageService'
import { RoomManager } from '../managers/RoomManager'

export class RoomHandlers {
  MessageService: MessageService

  constructor(
    private room: Room,
    private gameManager: GameManager,
    private roomManager: RoomManager
  ) {
    this.MessageService = new MessageService()
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
    console.log('player :', player)
    const chatMessage = this.MessageService.createChatMessage(player, message)
    console.log('chatMessage :', chatMessage)
    this.room.broadcast('message', chatMessage)
  }

  private handlePlayerReady(client: any) {
    const player = this.room.state.players.get(client.sessionId)
    if (!player.ready) {
      this.room.state.readyPlayers++
      const message = this.MessageService.createSystemMessage(
        `Player ${player.name} is ready`
      )

      if (
        this.room.state.readyPlayers === this.room.state.players.size &&
        this.room.state.players >= 2
      ) {
        this.gameManager.startGame()
        this.room.broadcast('gameStarted')
      }
    }
  }

  private handlePlayerUnready(client: any) {
    // refactor this
    const player = this.room.state.players.get(client.sessionId)
    if (player) {
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
      const message = this.MessageService.createSystemMessage(
        `seat ${seatNumber} is already taken`
      )
      client.send('message', message)
      return
    }
    console.log(`Player ${client.sessionId} joined to the game`)
    const message = this.MessageService.createSystemMessage(
      `Joined at seat ${seatNumber}!`
    )
    client.send('message', message)
  }
  private handlePlayerLeave(client: any) {
    const success = this.roomManager.handlePlayerLeaveGame(client.sessionId)
    if (success) {
      console.log(`Player ${client.sessionId} left the game`)
      const message = this.MessageService.createSystemMessage(
        `Player ${client.sessionId} left the game`
      )
      this.room.broadcast('message', message)
    }
  }
}
