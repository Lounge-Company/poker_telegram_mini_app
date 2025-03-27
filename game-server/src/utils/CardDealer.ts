import { Card } from '../rooms/schema/Card'
import { DeckManager } from '../managers/DeckManager'
import { ClientService } from '../services/clientService'
import { PlayerState } from '../rooms/schema/PlayerState'
import { MapSchema } from '@colyseus/schema'

export class CardDealer {
  constructor(
    private deckManager: DeckManager,
    private clientService: ClientService
  ) {}

  dealPlayerCards(
    deck: Card[],
    players: MapSchema<PlayerState>
  ): Map<string, Card[]> {
    const playerCards = new Map<string, Card[]>()

    for (const [id, player] of players) {
      const cards: Card[] = [
        this.deckManager.drawCard(deck),
        this.deckManager.drawCard(deck),
      ]
      if (player) {
        this.clientService.sendPlayerCards(id, cards)
      }
      playerCards.set(id, cards)
    }

    return playerCards
  }

  dealCommunityCards(deck: Card[], count: number): Card[] {
    const communityCards: Card[] = []

    for (let i = 0; i < count; i++) {
      const card = this.deckManager.drawCard(deck)
      if (card) {
        communityCards.push(card)
      }
    }

    this.clientService.broadcastCommunityCards(communityCards)
    return communityCards
  }
}
