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
  public shouldContinueBettingRound(): boolean {
    return (
      this.hasActivePlayers() && // минимум 1 активный игрок
      !this.allBetsEqual() && // ставки не уравнены
      this.getActivePlayersCount() > 1 // больше 1 игрока в игре
    )
  }
  private allPlayersActed(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.hasFolded && !player.isAllIn && !player.isMadeMove) {
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
}
