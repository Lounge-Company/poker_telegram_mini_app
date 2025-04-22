import { Card } from '../rooms/schema/Card'
import { DeckManager } from '../managers/DeckManager'
import { ClientService } from '../services/clientService'
import { PlayerState } from '../rooms/schema/PlayerState'
import { MapSchema } from '@colyseus/schema'
import { RoundType } from '../types/GameTypes'

export class CardDealer {
  constructor(
    private deckManager: DeckManager,
    private clientService: ClientService,
    private communityCards: Card[]
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

  dealCommunityCards(deck: Card[], count: number): void {
    for (let i = 0; i < count; i++) {
      const card = this.deckManager.drawCard(deck)
      if (card) {
        this.communityCards.push(card)
      }
    }
  }
  async dealRoundCards(deck: Card[], gamePhase: RoundType): Promise<void> {
    switch (gamePhase) {
      case RoundType.PREFLOP:
        this.dealCommunityCards(deck, 3)
        break
      case RoundType.FLOP:
        this.dealCommunityCards(deck, 1)
        break
      case RoundType.TURN:
        this.dealCommunityCards(deck, 1)
        break
    }
  }
  dealRemainingCommunityCards(deck: Card[]): void {
    if (this.communityCards.length < 5) {
      this.dealCommunityCards(deck, 5 - this.communityCards.length)
    }
  }
}
