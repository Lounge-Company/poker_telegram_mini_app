import { Card } from '../rooms/schema/Card'
import { GameState } from '../rooms/schema/GameState'
import { MessageService } from './messageService'
export class ClientService {
  private messageService: MessageService
  constructor() {
    this.messageService = new MessageService()
  }
  sendMessage(client: any, message: string) {
    client.send('message', message)
  }
  sendSystemMessage(client: any, message: string) {
    const systemMessage = this.messageService.createSystemMessage(message)
    client.send('message', systemMessage)
  }
  broadcastMessage(room: any, message: string, player: any) {
    const broadcastMessage = this.messageService.createChatMessage(
      player,
      message
    )
    room.broadcast('message', broadcastMessage)
  }
  broadcastSystemMessage(room: any, message: string) {
    const broadcastMessage = this.messageService.createSystemMessage(message)
    room.broadcast('message', broadcastMessage)
  }
  sendPlayerCards(client: any, cards: Card[]) {
    client.send('playerCards', cards)
  }
  broadcastCommunityCards(room: any, cards: Card[]) {
    room.broadcast('communityCards', cards)
  }
  requestAction(client: any) {
    client.send('requestAction')
  }
}
