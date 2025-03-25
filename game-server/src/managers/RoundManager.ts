import { PlayerRepository } from '../repositories/player.repository'
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
    if (this.state.activePlayers < this.state.MIN_PLAYERS) {
      return false
    }
    if (this.state.allInPlayersCount === this.state.players.size) {
      return false
    }
    return
  }
  resetRound() {
    this.state.gamePhase = RoundType.PREFLOP
    this.state.currentBet = 0
    this.state.activePlayers = this.state.players.size
    this.state.currentTurn = this.turnManager.getStartingPlayer()
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
