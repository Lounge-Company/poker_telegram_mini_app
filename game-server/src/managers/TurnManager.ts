import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'
import { ClientService } from '../services/clientService'
export class TurnManager {
  private state: GameState
  private readonly TURN_TIME = 30000
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
  getNextTurn(): string | null {
    const currentSeatIndex = this.state.seats.findIndex(
      (seat) => seat.playerId === this.state.currentTurn
    )

    let nextIndex = (currentSeatIndex + 1) % this.state.seats.length

    // Находим следующее занятое место
    while (!this.state.seats[nextIndex].playerId) {
      nextIndex = (nextIndex + 1) % this.state.seats.length
      if (nextIndex === currentSeatIndex) return null
    }

    this.state.currentTurn = this.state.seats[nextIndex].playerId
    return this.state.currentTurn
  }
  public waitForPlayerAction(room: any, player: PlayerState): Promise<void> {
    return new Promise((resolve) => {
      const client = room.clients.find(
        (c: { sessionId: string }) => c.sessionId === player.id
      )

      this.clientService.requestAction(client)

      const checkInterval = setInterval(() => {
        if (player.acted) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)

      setTimeout(() => {
        if (!player.acted) {
          player.hasFolded = true
          player.acted = true
          resolve()
        }
      }, 10000)
    })
  }
}
