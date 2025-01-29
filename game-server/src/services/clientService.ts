import { Card } from '../rooms/schema/Card'
import { MessageService } from './messageService'
export class ClientService {
  messageService: MessageService
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
    const broadcastMessage = this.messageService.createChatMessage(player, message)
    room.broadcast('message', broadcastMessage)
  }
  broadcastSystemMessage(room: any, message: string) {
    const broadcastMessage = this.messageService.createSystemMessage(message)
    room.broadcast('message', broadcastMessage)
  }
  sendPlayerCards(client: any, cards: Card[]) {
    client.send('playerCards', cards)
  }
  /**
   * broadcasting cards to all clients
   *
   * @example
   * // Client side
   * this.room.onMessage('playerCards', (cards) => {
   *  console.log('Received cards:', cards)
   *   this.ui.displayCards(cards)
   * })
   */
  broadcastCommunityCards(room: any, cards: Card[]) {
    room.broadcast('communityCards', cards)
  }
  /**
   * broadcasting turn to all clients
   *
   * @example
   * // Client side
   *this.room.onMessage('turn', (playerId) => {
   *  console.log('turn', playerId)
   * })
   */
  broadcastTurn(room: any, playerId: string) {
    console.log('broadcastTurn', playerId)
    room.broadcast('turn', playerId)
  }
  /**
   * Broadcasts a player's bet to all clients in the room.
   *
   * @param room - The room instance where the message should be broadcasted.
   * @param playerId - The ID of the player who placed the bet.
   * @param bet - The amount of the bet placed by the player.
   *
   * @example
   * // Client side
   * room.onMessage('playerBet', ({ playerId, bet }) => {
   *   console.log(`Player ${playerId} placed a bet of ${bet}`);
   * })
   */

  broadcastPlayerBet(room: any, playerId: string, bet: number) {
    room.broadcast('playerBet', { playerId, bet })
  }
  broadcastPlayercheck(room: any, playerId: string) {
    room.broadcast('playerCheck', playerId)
  }
  broadcastPlayerCall(room: any, playerId: string) {
    room.broadcast('playerCall', playerId)
  }
  broadcastPlayerFold(room: any, playerId: string) {
    room.broadcast('playerFold', playerId)
  }
  broadcastPlayerRaise(room: any, playerId: string, amount: number) {
    room.broadcast('playerRaise', { playerId, amount })
  }
  broadcastPlayerAllIn(room: any, playerId: string) {
    room.broadcast('playerAllIn', playerId)
  }
}
