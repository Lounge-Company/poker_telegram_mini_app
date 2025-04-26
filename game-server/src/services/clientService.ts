import { Card } from '../rooms/schema/Card'
import { WinnersResult } from '../types/winnerResult'
import { MessageService } from './messageService'
export class ClientService {
  private static instance: ClientService
  messageService: MessageService
  private room: any
  constructor() {
    this.messageService = new MessageService()
  }
  static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService()
    }
    return ClientService.instance
  }
  setRoom(room: any) {
    this.room = room
  }

  getClientById(playerId: string) {
    return this.room.clients.find(
      (c: { sessionId: string }) => c.sessionId === playerId
    )
  }

  sendMessage(playerId: string, message: string) {
    const client = this.getClientById(playerId)
    client.send('message', message)
  }
  sendSystemMessage(playerId: string, message: string) {
    const client = this.getClientById(playerId)
    const systemMessage = this.messageService.createSystemMessage(message)
    client.send('message', systemMessage)
  }
  broadcastMessage(message: string, player: any) {
    const broadcastMessage = this.messageService.createChatMessage(player, message)
    this.room.broadcast('message', broadcastMessage)
  }
  broadcastSystemMessage(message: string) {
    const broadcastMessage = this.messageService.createSystemMessage(message)
    this.room.broadcast('message', broadcastMessage)
  }
  /**
   * send player cards to client
   *
   * @example
   * // Client side
   * this.room.onMessage('playerCards', (cards) => {
   *  console.log('Received cards:', cards)
   *  // display player cards to client
   * })
   */
  sendPlayerCards(playerId: string, cards: Card[]) {
    const client = this.getClientById(playerId)
    if (client) {
      client.send('playerCards', cards)
    }
  }
  /**
   * broadcasting cards to all clients
   *
   * @example
   * // Client side
   * this.room.onMessage('communityCards', (cards) => {
   *  console.log('Received cards:', cards)
   *   // display community cards to clients
   * })
   */
  broadcastCommunityCards(cards: Card[]) {
    this.room.broadcast('communityCards', cards)
  }
  /**
   * broadcasting turn to all clients
   *
   * @example
   * // Client side
   *this.room.onMessage('turn', (playerId) => {
   *  console.log('turn', playerId)
   * // display turn to clients
   * })
   */
  broadcastTurn(playerId: string) {
    this.room.broadcast('turn', playerId)
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

  broadcastPlayerBet(playerId: string, bet: number) {
    this.room.broadcast('playerBet', { playerId, bet })
  }
  broadcastPlayerCheck(playerId: string) {
    this.room.broadcast('playerCheck', playerId)
  }
  broadcastPlayerCall(playerId: string) {
    this.room.broadcast('playerCall', playerId)
  }
  broadcastPlayerFold(playerId: string) {
    this.room.broadcast('playerFold', playerId)
  }
  broadcastPlayerRaise(playerId: string, amount: number) {
    this.room.broadcast('playerRaise', { playerId, amount })
  }
  broadcastPlayerAllIn(playerId: string) {
    this.room.broadcast('playerAllIn', playerId)
  }
  broadcastPlayerWin(playerId: string) {
    this.room.broadcast('playerWin', playerId)
  }
  broadcastGameResult(winnersResult: WinnersResult) {
    this.room.broadcast('gameResult', winnersResult)
  }
}
