import { GameEventEmitter } from '../events/gameEvents'
import { GameState } from '../rooms/schema/GameState'

export class PlayerManager {
  private state: GameState
  eventEmitter: GameEventEmitter
  constructor(state: GameState) {
    this.state = state
    this.eventEmitter = GameEventEmitter.getInstance()
  }
  subscribeToEvents() {
    this.eventEmitter.on('playerCheck', (playerId: string) =>
      this.handleCheck(playerId)
    )
    this.eventEmitter.on('playerCall', (playerId: string) =>
      this.handleCall(playerId)
    )
    this.eventEmitter.on('playerFold', (playerId: string) =>
      this.handleFold(playerId)
    )
    this.eventEmitter.on('playerBet', (playerId: string, amount: number) =>
      this.handleBet(playerId, amount)
    )
  }

  handleCheck(playerId: string) {
    const player = this.state.players.get(playerId)
    if (player && this.state.currentBet === 0) {
      player.acted = true
      return
    }
    return
  }
  handleCall(playerId: string) {
    const player = this.state.players.get(playerId)
    if (player && player.chips >= this.state.currentBet) {
      player.chips -= this.state.currentBet
      this.state.pot += this.state.currentBet
      player.acted = true
      return
    }
    return
  }
  handleFold(playerId: string) {
    const player = this.state.players.get(playerId)
    if (player) {
      player.hasFolded = true
      player.acted = true
      return
    }
    return
  }
  handleBet(playerId: string, amount: number) {
    const player = this.state.players.get(playerId)
    if (player && player.chips >= amount) {
      player.chips -= amount
      this.state.pot += amount
      this.state.currentBet = amount
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
      return
    }
    return
  }
  setActivePlayers() {
    this.state.activePlayers = Array.from(this.state.players.values()).filter(
      (player) => !player.hasFolded
    ).length
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
