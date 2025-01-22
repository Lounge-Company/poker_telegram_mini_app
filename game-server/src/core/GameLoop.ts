import { GameManager } from '../managers/GameManager'
import { GameState } from '../rooms/schema/GameState'
import { TurnManager } from '../managers/TurnManager'
import { Card } from '../rooms/schema/Card'
import { DeckManager } from '../managers/DeckManager'
import { MyRoom } from '../rooms/MyRoom'
import { RoundManager } from '../managers/RoundManager'
import { RoundType } from '../types/GameTypes'
import { PlayerManager } from '../managers/PlayerManager'

export class GameLoop {
  private playerCards: Map<string, Card[]> = new Map()
  private deck: Card[] = []
  private gameloopDelay: number = 3000
  private turnManager: TurnManager
  private gameManager: GameManager
  private state: GameState
  private room: MyRoom
  private deckManager: DeckManager
  private roundManager: RoundManager
  private playerManager: PlayerManager

  constructor(room: MyRoom, state: GameState) {
    this.state = state
    this.room = room
    this.turnManager = new TurnManager(state)
    this.roundManager = new RoundManager(state)
    this.gameManager = new GameManager(room, state)
    this.playerManager = new PlayerManager(state)
    this.deckManager = new DeckManager()
  }
  startGame() {
    this.state.gameStarted = true
    this.gameLoop()
  }
  stopGame() {
    this.state.gameStarted = false
  }
  async gameLoop() {
    if (this.state.gameStarted && this.state.players.size >= 2) {
      console.log('Game loop running...')

      // create deck
      this.deck = this.deckManager.createDeck()

      // deal cards
      this.playerCards = this.gameManager.dealCards(this.deck)

      // start betting round

      this.bettingRound()

      this.roundManager.resetRound()
      setTimeout(() => this.gameLoop(), this.gameloopDelay)
    } else {
      console.log('Game loop stopped.')
    }
  }
  private async bettingRound() {
    const currentPlayer = this.state.players.get(this.state.currentTurn)

    if (currentPlayer) {
      await this.turnManager.waitForPlayerAction(this.room, currentPlayer)
      const nextTurn = this.turnManager.getNextTurn()
      if (nextTurn) {
        this.bettingRound()
      }
    }
  }
}
