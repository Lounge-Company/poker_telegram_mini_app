import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'
export class TurnManager {
  private state: GameState
  private currentPlayerIndex: number = 0
  private turnTimeout: NodeJS.Timeout
  private readonly TURN_TIME = 30000

  constructor(state: GameState) {
    this.state = state
  }
  startTurnTimer() {
    // Очищаем предыдущий таймер если он был
    if (this.turnTimeout) {
      clearTimeout(this.turnTimeout)
    }

    // Устанавливаем новый таймер
    this.turnTimeout = setTimeout(() => {
      const currentPlayerId = this.getCurrentPlayerId()
      if (currentPlayerId) {
        // Автоматический фолд при истечении времени
        this.state.players.find((p) => p.id === currentPlayerId).hasFolded =
          true
        this.nextTurn()
      }
    }, this.TURN_TIME)
  }
  isPlayerTurn(playerId: string): boolean {
    return this.state.currentTurn === playerId
  }
  getCurrentPlayerId() {
    return this.state.currentTurn
  }
  startRound() {
    this.currentPlayerIndex = 0
    this.state.currentTurn = this.state.players[0].id
    this.startTurnTimer()
  }

  nextTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.state.players.length
    this.state.currentTurn = this.state.players[this.currentPlayerIndex].id
  }
}
