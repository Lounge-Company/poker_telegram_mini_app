import { GameManager } from '../managers/GameManager'
import { GameState } from '../rooms/schema/GameState'
import { TurnManager } from '../managers/TurnManager'
import { delay } from '../utils/delay'
import { PlayerState } from '../rooms/schema/PlayerState'
import { Card } from '../rooms/schema/Card'
import { DeckManager } from '../managers/DeckManager'

export class GameLoop {
  private playerCards: Map<string, Card[]> = new Map()
  private deck: Card[] = []
  private gameloopDelay: number = 3000
  private turnManager: TurnManager
  private state: GameState
  private deckManager: DeckManager
  constructor(
    state: GameState,
    turnManager: TurnManager,
    gameManager: GameManager
  ) {
    this.state = state
    this.turnManager = turnManager
  }

  async gameLoop() {
    if (this.state.gameStarted) {
      console.log('Game loop running...')
      this.deck = this.deckManager.createDeck()
      console.log('deck created :', this.deck)
      setTimeout(() => this.gameLoop(), this.gameloopDelay)
    } else {
      console.log('Game loop stopped.')
    }
  }
  private async bettingRound() {
    console.log('Starting betting round...')
    this.state.currentBet = 0
    this.state.pot = 0
    // while()
  }
}
