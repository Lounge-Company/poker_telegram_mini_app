import { GameManager } from '../managers/GameManager'
import { GameState } from '../rooms/schema/GameState'
import { TurnManager } from '../managers/TurnManager'
import { Card } from '../rooms/schema/Card'
import { DeckManager } from '../managers/DeckManager'
import { MyRoom } from '../rooms/MyRoom'
import { RoundManager } from '../managers/RoundManager'
import { PlayerManager } from '../managers/PlayerManager'
import { registerGameEvents } from '../events/gameLoopEventRegister'
import { PlayerState } from '../rooms/schema/PlayerState'
import { RoundType } from '../types/GameTypes'

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

      switch (this.state.gamePhase) {
        case RoundType.PREFLOP:
          this.state.gamePhase = RoundType.FLOP
          break
        case RoundType.FLOP:
          this.state.gamePhase = RoundType.TURN
          break
        case RoundType.TURN:
          this.state.gamePhase = RoundType.RIVER
          break
        case RoundType.RIVER:
          this.state.gamePhase = RoundType.SHOWDOWN
          break
        case RoundType.SHOWDOWN:
          break
        default:
          break
      }
    }
  }
  private async bettingRound(): Promise<boolean> {
    while (!this.turnManager.allPlayersActed()) {
      let currentPlayer: PlayerState = this.state.players.get(this.state.currentTurn)
      if (!currentPlayer) {
        return true
      }

      await this.turnManager.waitForPlayerAction(this.room, currentPlayer)
      const nextTurn = this.turnManager.getNextTurn()

      if (!nextTurn) {
        return true
      }
    }
    console.log('betting round finished')
    return true
  }
}
