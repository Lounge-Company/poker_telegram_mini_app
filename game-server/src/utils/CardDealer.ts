import { Card } from '../rooms/schema/Card'
import { DeckManager } from '../managers/DeckManager'
import { ClientService } from '../services/clientService'
import { PlayerState } from '../rooms/schema/PlayerState'
import { MapSchema } from '@colyseus/schema'
import { RoundType } from '../types/GameTypes'
import { PlayerRepository } from '../repositories/Player.repository'

export class CardDealer {
  constructor(
    private playerRepository: PlayerRepository,
    private deckManager: DeckManager,
    private clientService: ClientService,
    private getCommunityCards: () => Card[],
    private addCommunityCards: (card: Card) => void
  ) {}

  dealPlayerCards(
    deck: Card[],
    players: MapSchema<PlayerState>
  ): Map<string, Card[]> {
    const playerCards = new Map<string, Card[]>()

    for (const [id, player] of players) {
      const cards: Card[] = [
        this.deckManager.drawCard(deck),
        this.deckManager.drawCard(deck)
      ]
      const placeholderCards = [
        new Card().assign({ suit: 'back', rank: 'back' }),
        new Card().assign({ suit: 'back', rank: 'back' })
      ]

      this.playerRepository.setOpenCards(id, placeholderCards)
      this.clientService.sendPlayerCards(id, cards)

      playerCards.set(id, cards)
    }

    return playerCards
  }

  dealCommunityCards(deck: Card[], count: number): void {
    for (let i = 0; i < count; i++) {
      const card = this.deckManager.drawCard(deck)
      console.log('card', card.suit, card.rank)
      if (card) {
        this.addCommunityCards(card)
      }
    }
  }
  async dealRoundCards(deck: Card[], gamePhase: RoundType): Promise<void> {
    switch (gamePhase) {
      case RoundType.PREFLOP:
        console.log('deal flop')
        this.dealCommunityCards(deck, 3)
        break
      case RoundType.FLOP:
        console.log('deal turn')
        this.dealCommunityCards(deck, 1)
        break
      case RoundType.TURN:
        console.log('deal river')
        this.dealCommunityCards(deck, 1)
        break
    }
  }
  dealRemainingCommunityCards(deck: Card[]): void {
    const communityCards = this.getCommunityCards()
    if (communityCards.length < 5) {
      this.dealCommunityCards(deck, 5 - communityCards.length)
    }
  }
}
