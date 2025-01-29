import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'

export class BetManager {
  private state: GameState

  constructor(state: GameState) {
    this.state = state
  }

  public allBetsEqual(): boolean {
    let targetBet = this.state.currentBet

    for (const player of this.state.players.values()) {
      if (player.hasFolded || player.isAllIn) continue

      if (player.currentBet !== targetBet) {
        return false
      }
    }
    return true
  }

  public updatePot(): void {
    let totalBets = 0
    for (const player of this.state.players.values()) {
      totalBets += player.currentBet
      player.currentBet = 0
    }
    this.state.pot += totalBets
  }
}
