import { GameState } from '../rooms/schema/GameState'
import { RoundType } from '../types/GameTypes'
import { TurnManager } from './TurnManager'
export class RoundManager {
  private state: GameState
  private turnManager: TurnManager
  constructor(state: GameState) {
    this.state = state
    this.turnManager = new TurnManager(state)
  }
  getCurrentRound() {
    return this.state.gamePhase
  }
  shouldContinueBettingRound(): boolean {
    return this.turnManager.allPlayersActed() // сходили ли все игроки?
  }
  resetRound() {
    this.state.gamePhase = RoundType.PREFLOP
  }
  nextRound(round: RoundType | undefined) {
    switch (this.state.gamePhase) {
      case RoundType.PREFLOP:
        this.state.gamePhase = round | RoundType.FLOP
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
        this.state.gamePhase = RoundType.PREFLOP
        break
    }
  }
}
