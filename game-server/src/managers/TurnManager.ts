import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'
import { ClientService } from '../services/clientService'
export class TurnManager {
  getCurrentTurn(): string {
    return this.state.currentTurn
  }
  private state: GameState
  private clientService: ClientService

  constructor(state: GameState) {
    this.state = state
    this.clientService = new ClientService()
  }

  getStartingPlayer(): string {
    for (let i = 0; i < this.state.seats.length; i++) {
      if (this.state.seats[i].playerId) {
        return this.state.seats[i].playerId
      }
    }
  }
  public allPlayersActed(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.acted) {
        return false
      }
    }
    return true
  }

  getNextPlayerTurn(): string | undefined {
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
      this.clientService.broadcastTurn(player.id)

      const timer = setTimeout(() => {
        if (!player.acted) {
          player.hasFolded = true
          player.acted = true
          resolve()
        }
      }, this.state.TURN_TIME)

      const checkInterval = setInterval(() => {
        if (player.acted) {
          console.log('player acted')
          clearTimeout(timer)
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
    })
  }
}
