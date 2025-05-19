import { Card } from '../../rooms/schema/Card'
import { GameState } from '../../rooms/schema/GameState'
import { RoundType } from '../../types/GameTypes'

export interface IGameStateRepository {
  getGameState(): GameState
  getGamePhase(): RoundType
  setGamePhase(phase: RoundType): void
  getActivePlayers(): number
  setActivePlayers(count?: number): void
  getMinPlayers(): number
  getAllInPlayersCount(): number
  resetBets(): void
  getCurrentTurn(): string
  setCurrentTurn(turn: string): void
  getCommunityCards(): Card[]
  setCommunityCards(cards: Card[]): void
  addCommunityCard(card: Card): void
  getReadyPlayers(): number
  setReadyPlayers(count: number): void
}
