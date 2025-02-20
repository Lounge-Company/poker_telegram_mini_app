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
  shouldContinueRounds(): boolean {
    const activePlayers = Array.from(this.state.players.values()).filter(
      (player) => !player.hasFolded && !player.isAllIn
    )
    if (activePlayers.length < this.state.MIN_PLAYERS) {
      return false
    }
    return
  }
  resetRound() {
    this.state.gamePhase = RoundType.PREFLOP
    this.state.currentBet = 0
    this.state.currentTurn = this.turnManager.getStartingPlayer()
    console.log('set current turn :', this.state.currentTurn)
  }
  switchRound(round: RoundType | undefined) {
    switch (this.state.gamePhase) {
      case RoundType.PREFLOP:
        this.state.gamePhase = round | RoundType.FLOP
        break
      case RoundType.FLOP:
        this.state.gamePhase = round | RoundType.TURN
        break
      case RoundType.TURN:
        this.state.gamePhase = round | RoundType.RIVER
        break
      case RoundType.RIVER:
        this.state.gamePhase = round | RoundType.SHOWDOWN
        break
      case RoundType.SHOWDOWN:
        this.state.gamePhase = round | RoundType.PREFLOP
        break
    }
  }
}
