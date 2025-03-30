import { GameState } from '../rooms/schema/GameState'
import { RoundType } from '../types/GameTypes'

export class GameStateRepository implements GameStateRepository {
  constructor(private state: GameState) {}

  getGamePhase(): RoundType {
    return this.state.gamePhase
  }

  setGamePhase(phase: RoundType): void {
    this.state.gamePhase = phase
  }

  getActivePlayers(): number {
    return this.state.activePlayers
  }

  getMinPlayers(): number {
    return this.state.MIN_PLAYERS
  }

  getAllInPlayersCount(): number {
    return this.state.allInPlayersCount
  }

  resetBets(): void {
    this.state.currentBet = 0
    this.state.activePlayers = this.state.players.size
  }

  getCurrentTurn(): string {
    return this.state.currentTurn
  }

  setCurrentTurn(turn: string): void {
    this.state.currentTurn = turn
  }
}
