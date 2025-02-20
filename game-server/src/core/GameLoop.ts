import { GameManager } from '../managers/GameManager'
import { GameState } from '../rooms/schema/GameState'
import { TurnManager } from '../managers/TurnManager'
import { Card } from '../rooms/schema/Card'
import { DeckManager } from '../managers/DeckManager'
import { MyRoom } from '../rooms/MyRoom'
import { RoundManager } from '../managers/RoundManager'
import { PlayerManager } from '../managers/PlayerManager'
import { PlayerState } from '../rooms/schema/PlayerState'
import { GameEventEmitter } from '../events/gameEvents'

export class GameLoop {
  private playerCards: Map<string, Card[]> = new Map()
  private deck: Card[] = []
  gameloopDelay: number = 0
  turnManager: TurnManager
  gameManager: GameManager
  deckManager: DeckManager
  roundManager: RoundManager
  playerManager: PlayerManager
  state: GameState
  room: MyRoom
  eventEmitter: GameEventEmitter
  constructor(room: MyRoom, state: GameState) {
    this.state = state
    this.room = room
    this.turnManager = new TurnManager(state)
    this.roundManager = new RoundManager(state)
    this.gameManager = new GameManager(room, state)
    this.playerManager = new PlayerManager(state)
    this.deckManager = new DeckManager()

    this.eventEmitter = GameEventEmitter.getInstance()
    this.subscribeToEvents()
  }

  private subscribeToEvents() {
    this.eventEmitter.on('gameStart', () => this.startGame())
    this.eventEmitter.on('gameEnd', () => this.stopGame())
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
    while (
      this.state.gameStarted &&
      this.state.players.size >= this.state.MIN_PLAYERS
    ) {
      console.log('Game loop running...')

      // create deck
      this.deck = this.deckManager.createDeck()

      // // deal cards
      this.playerCards = this.gameManager.dealCards(this.deck)

      // start betting round

      // this.roundsCycle()
      await this.bettingRound()

      // check if game is over

      this.playerManager.resetPlayers()
      this.roundManager.resetRound()
      await new Promise((resolve) => setTimeout(resolve, this.gameloopDelay))
    }
    console.log('Game loop stopped.')
  }
  async roundsCycle() {
    while (this.roundManager.shouldContinueRounds()) {
      await this.bettingRound()
      this.roundManager.switchRound(undefined)
    }
  }
  private async bettingRound(): Promise<boolean> {
    while (!this.turnManager.allPlayersActed()) {
      let currentPlayer: PlayerState = this.state.players.get(this.state.currentTurn)
      if (!currentPlayer) {
        return
      }
      if (this.state.activePlayers == 1) {
        return
      }

      await this.turnManager.waitForPlayerAction(this.room, currentPlayer)
      const nextTurn = this.turnManager.getNextTurn()

      if (!nextTurn) {
        return
      }
    }
    console.log('betting round finished')
    return
  }
}
