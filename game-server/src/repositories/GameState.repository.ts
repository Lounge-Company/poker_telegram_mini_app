import { IGameStateRepository } from '../interfaces/repositories/IGameStateRepository'
import { Card } from '../rooms/schema/Card'
import { GameState } from '../rooms/schema/GameState'
import { RoundType } from '../types/GameTypes'

export class GameStateRepository implements IGameStateRepository {
  constructor(private state: GameState) {}

  getGameState(): GameState {
    return this.state
  }

  getGamePhase(): RoundType {
    return this.state.gamePhase
  }

  setGamePhase(phase: RoundType): void {
    this.state.gamePhase = phase
  }

  getActivePlayers(): number {
    return this.state.activePlayers
  }
  setActivePlayers(count: number): void {
    this.state.activePlayers = count
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
  setDealerId(dealerId: string): void {
    this.state.dealerId = dealerId
  }
  getDealerId(): string {
    return this.state.dealerId
  }
  getBinds(): { SMALL: number; BIG: number } {
    return { SMALL: this.state.SMALL_BLIND, BIG: this.state.BIG_BLIND }
  }
  getCommunityCards(): Card[] {
    return this.state.communityCards
  }
  setCommunityCards(cards: Card[]): void {
    this.state.communityCards = cards
  }
  addCommunityCard(card: Card): void {
    this.state.communityCards.push(card)
  }
  getReadyPlayers(): number {
    return this.state.readyPlayers
  }
  setReadyPlayers(count: number): void {
    this.state.readyPlayers = count
  }
}
