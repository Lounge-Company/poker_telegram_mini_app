export interface IBetRepository {
  getCurrentBet(): number
  setCurrentBet(amount: number): void
  getPot(): number
  setPot(amount: number): void
}
