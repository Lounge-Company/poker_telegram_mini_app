import { Card } from '../rooms/schema/Card'
import { CARD_VALUES } from '../utils/CardUtils'

export class DeckManager {
  private deck: Card[] = []
  initializeDeck(): Card[] {
    const { suits, ranks } = CARD_VALUES

    this.deck = []
    for (const suit of suits) {
      for (const rank of ranks) {
        const card = new Card()
        card.suit = suit
        card.rank = rank
        this.deck.push(card)
      }
    }

    this.shuffleDeck()
    return this.deck
  }

  private shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }
  drawCard(): Card {
    return this.deck.pop()
  }
}
