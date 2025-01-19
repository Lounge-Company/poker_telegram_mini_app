import { GameState } from '../rooms/schema/GameState'
import { RoundType } from '../types/GameTypes'
import { TurnManager } from './TurnManager'
export class RoundManager {
  private currentRound: RoundType = RoundType.PREFLOP
  private state: GameState
  private turnManager: TurnManager
  constructor(state: GameState) {
    this.state = state
    this.turnManager = new TurnManager(state)
  }
  getCurrentRound() {
    return this.currentRound
  }
  public shouldContinueBettingRound(): boolean {
    return this.turnManager.allPlayersActed() // сходили ли все игроки?
  }
  nextRound() {
    switch (this.currentRound) {
      case RoundType.PREFLOP:
        this.currentRound = RoundType.FLOP
        this.state.gamePhase = 'flop'
        break
      case RoundType.FLOP:
        this.currentRound = RoundType.TURN
        break
      case RoundType.TURN:
        this.currentRound = RoundType.RIVER
        break
      case RoundType.RIVER:
        this.currentRound = RoundType.SHOWDOWN
        break
      case RoundType.SHOWDOWN:
        this.currentRound = RoundType.PREFLOP
        // move dealer index
        this.moveDealer()
        break
    }
  }
  resetRound() {
    this.currentRound = RoundType.PREFLOP
  }
  private moveDealer() {
    const currentDealerSeatIndex = this.state.seats.findIndex(
      (seat) => seat.playerId === this.state.dealerPosition
    )

    const nextDealerSeatIndex =
      (currentDealerSeatIndex + 1) % this.state.seats.length

    let newDealerIndex = nextDealerSeatIndex
    while (!this.state.seats[newDealerIndex].playerId) {
      newDealerIndex = (newDealerIndex + 1) % this.state.seats.length
    }

    this.state.dealerPosition = this.state.seats[newDealerIndex].playerId
  }
}
