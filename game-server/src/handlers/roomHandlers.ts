import { Room } from 'colyseus'
import { GameManager } from '../managers/GameManager'
import { MessageService } from '../services/messageService'

export class RoomHandlers {
  MessageService: MessageService

  constructor(private room: Room, private gameManager: GameManager) {
    this.MessageService = new MessageService(room.state)
  }

  public registerHandlers() {
    this.room.onMessage('message', this.handleChatMessage.bind(this))
    this.room.onMessage('ready', this.handlePlayerReady.bind(this))
    this.room.onMessage('unready', this.handlePlayerUnready.bind(this))
    console.log('room handlers registered successfully')
  }

  private handleChatMessage(client: any, message: string) {
    this.room.onMessage('message', (client, message) => {
      const chatMessage = this.MessageService.createChatMessage(
        client.sessionId,
        message
      )
      console.log('chatMessage :', chatMessage)
      this.room.broadcast('message', chatMessage)
    })
  }

  private handlePlayerReady(client: any) {
    this.room.onMessage('ready', (client) => {
      const player = this.room.state.players.get(client.sessionId)
      if (player) {
        player.ready = true
        this.room.broadcast('playerReady', client.sessionId)
      }
    })
  }

  private handlePlayerUnready(client: any) {
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
}
