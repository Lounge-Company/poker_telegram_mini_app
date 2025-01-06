import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'
export class TurnManager {
  private state: GameState
  private playerOrder: string[] = []
  private dealerPosition: number = 0
  private currentPosition: number = 0
  private turnTimeout: NodeJS.Timeout
  private readonly TURN_TIME = 30000

  constructor(state: GameState) {
    this.state = state
  }
  startTurnTimer() {
    if (this.turnTimeout) {
      clearTimeout(this.turnTimeout)
    }

    this.turnTimeout = setTimeout(() => {
      const currentPlayerId = this.getCurrentPlayerId()
      if (currentPlayerId) {
        const currentPlayer = this.state.players.get(currentPlayerId)
        if (currentPlayer) {
          currentPlayer.hasFolded = true
          this.nextTurn()
        }
      }
    }, this.TURN_TIME)
  }
  stopTurnTimer() {
    if (this.turnTimeout) {
      clearTimeout(this.turnTimeout)
    }
  }
  isPlayerTurn(playerId: string): boolean {
    return this.state.currentTurn === playerId
  }
  getCurrentPlayerId() {
    return this.state.currentTurn
  }

  public nextTurn() {
    do {
      this.currentPosition =
        (this.currentPosition + 1) % this.playerOrder.length
      const nextPlayer = this.state.players.get(
        this.playerOrder[this.currentPosition]
      )

      if (!nextPlayer.hasFolded && !nextPlayer.isAllIn) {
        this.state.currentTurn = nextPlayer.id
        break
      }
    } while (true)

    this.startTurnTimer()
  }
}
