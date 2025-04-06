import { RoundType } from '../../types/GameTypes'

export interface IGameStateRepository {
  getGamePhase(): RoundType
  setGamePhase(phase: RoundType): void
  getActivePlayers(): number
  setActivePlayers(count?: number): void
  getMinPlayers(): number
  getAllInPlayersCount(): number
  resetBets(): void
  getCurrentTurn(): string
  setCurrentTurn(turn: string): void
}
