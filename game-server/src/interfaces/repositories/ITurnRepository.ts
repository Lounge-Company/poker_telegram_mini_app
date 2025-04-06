export interface ITurnRepository {
  getCurrentTurn(): string
  setCurrentTurn(PlayerId: string): void
}
