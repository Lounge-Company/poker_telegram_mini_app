import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'
export class TurnManager {
  private state: GameState
  private readonly TURN_TIME = 30000

  constructor(state: GameState) {
    this.state = state
  }

  private hasActivePlayers(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.hasFolded && !player.isAllIn) {
        return true
      }
    }
    return false
  }
  public allPlayersActed(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.acted) {
        return false
      }
    }
    return true
  }
  private allBetsEqual(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.hasFolded && !player.isAllIn) {
        if (player.currentBet !== this.state.currentBet) {
          return false
        }
      }
    }
    return true
  }
  public getCurrentPlayer(): PlayerState | undefined {
    return this.state.players.get(this.state.currentTurn)
  }
  public waitForPlayerAction(player: PlayerState): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (player.acted) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
    })
  }
}
