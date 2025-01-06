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
    // refactor this
    this.room.onMessage('ready', (client) => {
      const player = this.room.state.players.get(client.sessionId)
      if (player) {
        player.ready = true
        this.room.broadcast('playerReady', client.sessionId)
      }
    })
  }

  private handlePlayerUnready(client: any) {
    // refactor this
    this.room.onMessage('unready', (client) => {
      const player = this.room.state.players.get(client.sessionId)
      if (player) {
        player.ready = false
        this.room.broadcast('playerUnready', client.sessionId)
      }
    })
  }

  private handlePlayerAction(client: any, action: string, amount: number) {
    this.room.onMessage('action', (client, data) => {
      const { action, amount } = data
    })
  }
  private handlePlayerJoin(client: any) {
    const success = this.roomManager.handlePlayerJoinToGame(client.sessionId)
    if (success) {
      console.log(`Player ${client.sessionId} joined to the game`)
      const message = this.MessageService.createSystemMessage(
        `Player ${client.sessionId} joined to the game`
      )
      this.room.broadcast('message', message)
    }
  }
  private handlePlayerLeave(client: any) {
    const success = this.roomManager.handlePlayerLeaveGame(client.sessionId)
    if (success) {
      const message = this.MessageService.createSystemMessage(
        `Player ${client.sessionId} left the game`
      )
      this.room.broadcast('message', message)
    }
  }
}
