import { Card } from '../rooms/schema/Card'
import { CARD_VALUES } from '../utils/game/CardUtils'

export class DeckManager {
  constructor(private deck: Card[]) {}
  createDeck(): Card[] {
    const { suits, ranks } = CARD_VALUES

    for (const suit of suits) {
      for (const rank of ranks) {
        const card = new Card()
        card.suit = suit
        card.rank = rank
        this.deck.push(card)
      }
    }

    this.shuffleDeck(this.deck)
    return this.deck
  }

  private shuffleDeck(deck: Card[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
  }
  drawCard(deck: Card[]): Card {
    return deck.pop()
  }
  resetDeck() {
    this.deck = []
  }
}
