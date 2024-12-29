import { GameLogic } from '../core/GameLogic'
import { GameState } from '../rooms/schema/GameState'
import { TurnManager } from './TurnManager'

export class GameLoopManager {
  private gameLogic: GameLogic
  private turnManager: TurnManager
  private state: GameState
  constructor(state: GameState, turnManager: TurnManager) {
    this.state = state
    this.turnManager = turnManager
    this.gameLogic = new GameLogic(state, turnManager)
  }
  async startGameLoop() {
    while (this.state.gameStarted) {
      try {
        // Подготовка раунда
        this.gameLogic.initializeDeck()
        this.gameLogic.dealInitialCards()
        let roundActive = true

        while (roundActive && this.gameLogic.shouldContinueRound()) {
          switch (this.state.gamePhase) {
            case 'preFlop':
              this.turnManager.startRound()
              await this.waitForBettingRound()
              break
            case 'flop':
              break
            case 'turn':
              break
            case 'river':
              break
            default:
              console.log('Invalid game phase')
              break
          }
          this.state.gamePhase = 'preFlop'
        }
      } catch (error) {
        console.log('Error in game loop:', error)
      }
    }
  }
  private waitForBettingRound(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.gameLogic.allPlayersActed()) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 1000)
    })
  }
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
