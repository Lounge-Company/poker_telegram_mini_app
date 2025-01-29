import { GameState } from '../rooms/schema/GameState'

export class PlayerManager {
  private state: GameState
  constructor(state: GameState) {
    this.state = state
  }
  hasActivePlayers(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.hasFolded && !player.isAllIn) {
        return true
      }
    }
    return false
  }
  hasAllPlayersAllIn(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.isAllIn && !player.hasFolded) {
        return false
      }
    }
    return true
  }
  moveDealer() {
    const currentDealerSeatIndex = this.state.seats.findIndex(
      (seat) => seat.playerId === this.state.dealerId
    )

    const nextDealerSeatIndex =
      (currentDealerSeatIndex + 1) % this.state.seats.length

    let newDealerIndex = nextDealerSeatIndex
    while (!this.state.seats[newDealerIndex].playerId) {
      newDealerIndex = (newDealerIndex + 1) % this.state.seats.length
    }

    this.state.dealerId = this.state.seats[newDealerIndex].playerId
  }
  async resetPlayers() {
    this.state.players.forEach((player) => {
      player.acted = false
      player.hasFolded = false
      player.isAllIn = false
      player.currentBet = 0
    })
  }

  leaveGame(playerId: string) {
    const player = this.state.players.get(playerId)
    if (player) {
      player.hasFolded = true
      player.isAllIn = true
    }
  }
}
