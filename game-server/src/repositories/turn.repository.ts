import { ITurnRepository } from '../interfaces/repositories/ITurnRepository'
import { GameState } from '../rooms/schema/GameState'

export class TurnRepository implements ITurnRepository {
  constructor(private state: GameState) {}
  getCurrentTurn(): string {
    return this.state.currentTurn
  }
  setCurrentTurn(playerId: string): void {
    this.state.currentTurn = playerId
  }
}
