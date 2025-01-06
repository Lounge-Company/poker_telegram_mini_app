import { GameManager } from '../managers/GameManager'
import { GameState } from '../rooms/schema/GameState'
import { TurnManager } from '../managers/TurnManager'
import { delay } from '../utils/delay'
export class GameLoopManager {
  private GameManager: GameManager
  private turnManager: TurnManager
  private state: GameState

  constructor(state: GameState, turnManager: TurnManager) {
    this.state = state
    this.turnManager = turnManager
    this.GameManager = new GameManager(state)
  }

  async startGameLoop() {
    while (this.state.gameStarted) {
      try {
        // Подготовка раунда
        // this.GameManager.initializeDeck()
        // this.GameManager.dealInitialCards()

        while (this.GameManager.shouldContinueRound()) {
          switch (this.state.gamePhase) {
            case 'preFlop':
              // this.turnManager.startRound()
              // await this.waitForBettingRound()
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
  private async runBettingRound() {
    while (this.GameManager.shouldContinueRound()) {
      await delay(1000)
    }
  }
  private waitForBettingRound(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.GameManager.allPlayersActed()) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 1000)
    })
  }
}
