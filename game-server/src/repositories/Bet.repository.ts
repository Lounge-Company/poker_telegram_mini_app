import { IBetRepository } from '../interfaces/repositories/IBetRepository'
import { GameState } from '../rooms/schema/GameState'

export class BetRepository implements IBetRepository {
  constructor(private state: GameState) {}
  getCurrentBet(): number {
    return this.state.currentBet
  }
  setCurrentBet(amount: number): void {
    this.state.currentBet = amount
  }
  getPot(): number {
    return this.state.pot
  }
  setPot(amount: number): void {
    this.state.pot = amount
  }
}
