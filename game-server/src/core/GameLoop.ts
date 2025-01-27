import { GameManager } from '../managers/GameManager'
import { GameState } from '../rooms/schema/GameState'
import { TurnManager } from '../managers/TurnManager'
import { Card } from '../rooms/schema/Card'
import { DeckManager } from '../managers/DeckManager'
import { MyRoom } from '../rooms/MyRoom'
import { RoundManager } from '../managers/RoundManager'
import { PlayerManager } from '../managers/PlayerManager'
import { registerGameEvents } from '../events/gameLoopEventRegister'

export class GameLoop {
  private playerCards: Map<string, Card[]> = new Map()
  private deck: Card[] = []
  private gameloopDelay: number = 0
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
    registerGameEvents(this)
  }
  startGame() {
    this.state.gameStarted = true
    this.state.currentTurn = this.turnManager.getStartingPlayer()
    this.gameLoop()
  }
  stopGame() {
    this.state.gameStarted = false
  }
  async gameLoop() {
    if (this.state.gameStarted && this.state.players.size >= 2) {
      console.log('Game loop running...')

      // create deck
      // this.deck = this.deckManager.createDeck()

      // // deal cards
      // this.playerCards = this.gameManager.dealCards(this.deck)

      // start betting round

      await this.bettingRound()

      // start new game
      this.playerManager.resetPlayers()
      // this.roundManager.resetRound()
      setTimeout(() => this.gameLoop(), this.gameloopDelay)
    } else {
      console.log('Game loop stopped.')
    }
  }
  private async bettingRound(): Promise<boolean> {
    while (!this.turnManager.allPlayersActed()) {
      console.log('============================')
      let currentPlayer = this.state.players.get(this.state.currentTurn)
      console.log('Current turn: ', this.state.currentTurn)
      console.log(`Current player: ${currentPlayer?.name} - ${currentPlayer?.acted}`)
      if (!currentPlayer) {
        return true
      }

      await this.turnManager.waitForPlayerAction(this.room, currentPlayer)
      const nextTurn = this.turnManager.getNextTurn()

      if (!nextTurn) {
        return true
      }
    }
    this.state.currentTurn = this.turnManager.getStartingPlayer()
    return true
  }
}
