import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'
import { ClientService } from '../services/clientService'
export class TurnManager {
  private state: GameState
  private readonly TURN_TIME = 2000
  private clientService: ClientService

  constructor(state: GameState) {
    this.state = state
    this.clientService = new ClientService()
  }

  private hasActivePlayers(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.hasFolded && !player.isAllIn) {
        return true
      }
    }
    return false
  }
  getStartingPlayer(): string {
    const firstOccupiedSeat = this.state.seats.find((seat) => seat.playerId !== '')
    return firstOccupiedSeat.playerId
  }
  public allPlayersActed(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.acted) {
        return false
      }
    }
    return true
  }
  private allBetsEqual(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.hasFolded && !player.isAllIn) {
        if (player.currentBet !== this.state.currentBet) {
          return false
        }
      }
    }
    return true
  }
  public getCurrentPlayer(): PlayerState | undefined {
    return this.state.players.get(this.state.currentTurn)
  }
  private isPlayerEligibleForTurn(playerId: string): boolean {
    const player = this.state.players.get(playerId)
    return playerId && !player?.hasFolded && !player?.isAllIn && !player?.acted
  }

  getNextTurn(): string | undefined {
    // Если активных игроков нет, сразу выходим
    // if (!this.hasActivePlayers()) {
    //   return undefined
    // }

    const currentSeatIndex = this.state.seats.findIndex(
      (seat) => seat.playerId === this.state.currentTurn
    )

    for (let i = 0; i <= this.state.seats.length; i++) {
      const nextIndex = (currentSeatIndex + i) % this.state.seats.length
      const playerId = this.state.seats[nextIndex].playerId
      const player = this.state.players.get(playerId)

      if (player && !player.acted) {
        console.log('next index ', nextIndex)
        console.log('player id ', playerId)
        return (this.state.currentTurn = playerId)
      }
    }

    return undefined
  }
  public async waitForPlayerAction(room: any, player: PlayerState): Promise<void> {
    return new Promise((resolve) => {
      this.clientService.broadcastTurn(room, player.id)

      const timer = setTimeout(() => {
        if (!player.acted) {
          player.hasFolded = true
          player.acted = true
          resolve()
        }
      }, this.TURN_TIME)

      const checkInterval = setInterval(() => {
        if (player.acted) {
          clearTimeout(timer)
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
    })
  }
}
