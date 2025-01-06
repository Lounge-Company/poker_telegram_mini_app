import { GameState } from '../rooms/schema/GameState'
import { TurnManager } from '../managers/TurnManager'
export class actionService {
  constructor(private state: GameState, private turnManager: TurnManager) {}
  handleBet(playerId: string, amount: number): boolean {
    // Логика обработки ставки
    const player = this.state.players.get(playerId)
    if (player && player.chips >= amount) {
      player.chips -= amount
      this.state.pot += amount
      this.state.currentBet = amount
      return true
    }
    return false
  }
  handleFold(playerId: string): boolean {
    // Логика обработки сброса карт
    const player = this.state.players.get(playerId)
    if (player) {
      player.hasFolded = true
      this.turnManager.nextTurn()
      return true
    }
    return false
  }
  handleCheck(playerId: string): boolean {
    // Логика обработки проверки
    const player = this.state.players.get(playerId)
    if (player && this.state.currentBet === 0) {
      this.turnManager.nextTurn()
      return true
    }
    return false
  }
  handleCall(playerId: string): boolean {
    const player = this.state.players.get(playerId)
    if (player && player.chips >= this.state.currentBet) {
      player.chips -= this.state.currentBet
      this.state.pot += this.state.currentBet
      this.turnManager.nextTurn()
      return true
    }
    return false
  }
  handleRaise(playerId: string, amount: number): boolean {
    const player = this.state.players.get(playerId)
    if (player && amount > this.state.currentBet && player.chips >= amount) {
      player.chips -= amount
      this.state.pot += amount
      this.state.currentBet = amount
      this.turnManager.nextTurn()
      return true
    }
    return false
  }
}
