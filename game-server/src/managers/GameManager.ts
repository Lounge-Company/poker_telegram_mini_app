import { TurnManager } from './TurnManager'
import { GameState } from '../rooms/schema/GameState'
import { ActionService } from '../services/actionService'
import { DeckManager } from './DeckManager'
import { Card } from '../rooms/schema/Card'
import { ClientService } from '../services/clientService'

export class GameManager {
  state: GameState
  turnManager: TurnManager
  actionService: ActionService
  deckManager: DeckManager
  clientService: ClientService
  room: any
  constructor(room: any, state: GameState) {
    this.room = room
    this.state = state
    this.turnManager = new TurnManager(state)
    this.deckManager = new DeckManager()
    this.clientService = new ClientService()
  }

  dealCards(deck: Card[]): Map<string, Card[]> {
    const playerCards = new Map<string, Card[]>()
    for (const [playerId, player] of this.state.players) {
      const cards: Card[] = [
        this.deckManager.drawCard(deck),
        this.deckManager.drawCard(deck),
      ]
      const client = this.room.clients.find(
        (c: { sessionId: string }) => c.sessionId === playerId
      )
      this.clientService.sendPlayerCards(client, cards)
      playerCards.set(playerId, cards)
    }
    return playerCards
  }
  dealCommunityCards(deck: Card[], count: number): Card[] {
    const communityCards: Card[] = []
    for (let i = 0; i < count; i++) {
      const card = this.deckManager.drawCard(deck)
      communityCards.push(card)
    }
    this.clientService.broadcastCommunityCards(this.room, communityCards)
    return communityCards
  }
  resetGame() {}
  determineWinner(): string {
    return ''
  }
  initializeBlinds() {}
}
