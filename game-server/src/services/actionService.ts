import { GameState } from '../rooms/schema/GameState'
export class ActionService {
  state: GameState
  constructor(state: GameState) {
    this.state = state
  }
  bet(playerId: string, amount: number): boolean {
    // bet logic
    const player = this.state.players.get(playerId)
    if (player && player.chips >= amount) {
      player.chips -= amount
      console.log('player chips :', player.chips)
      this.state.pot += amount
      console.log('pot :', this.state.pot)
      this.state.currentBet = amount
      console.log('current bet :', this.state.currentBet)
      player.acted = true

      for (let player of this.state.players.values()) {
        if (player.id === playerId) continue
        if (
          !player.hasFolded &&
          !player.isAllIn &&
          player.currentBet !== this.state.currentBet
        ) {
          console.log('player switched :', player.id)
          player.acted = false
        }
      }
      return true
    }
    return false
  }
  fold(playerId: string): boolean {
    // fold logic
    const player = this.state.players.get(playerId)
    if (player) {
      player.hasFolded = true
      return true
    }
    return false
  }
  check(playerId: string): boolean {
    // check logic
    const player = this.state.players.get(playerId)
    if (player && this.state.currentBet === 0) {
      player.acted = true
      return true
    }
    return false
  }
  call(playerId: string): boolean {
    const player = this.state.players.get(playerId)
    if (player && player.chips >= this.state.currentBet) {
      player.chips -= this.state.currentBet
      this.state.pot += this.state.currentBet
      player.acted = true
      return true
    }
    return false
  }
}
